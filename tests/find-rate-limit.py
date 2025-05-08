#!/usr/bin/env python3
import asyncio
import aiohttp
import time
import argparse
from tqdm import tqdm  # For a nice progress bar

async def make_request(session, url, request_id):
    """Make a single GET request to the specified URL"""
    try:
        async with session.get(url) as response:
            response_text = await response.text()
            status = response.status
            return {
                "request_id": request_id,
                "status": status,
                "response_length": len(response_text)
            }
    except Exception as e:
        return {
            "request_id": request_id,
            "status": "Error",
            "response_length": 0,
            "error": str(e)
        }

async def send_requests(url, num_requests, concurrent_limit=100):
    """Send N requests to the URL with a concurrency limit"""
    # Create a client session that will be used for all requests
    async with aiohttp.ClientSession() as session:
        # Create a list of tasks
        tasks = []
        for i in range(num_requests):
            tasks.append(make_request(session, url, i+1))
        
        # Use asyncio.gather to run tasks concurrently with a limit
        results = []
        for i in tqdm(range(0, len(tasks), concurrent_limit), desc="Processing batches"):
            batch = tasks[i:i+concurrent_limit]
            batch_results = await asyncio.gather(*batch)
            results.extend(batch_results)
        
        return results

def main():
    parser = argparse.ArgumentParser(description='Send N concurrent requests to a URL')
    parser.add_argument('-n', '--num_requests', type=int, default=10, 
                        help='Number of requests to send (default: 10)')
    parser.add_argument('-c', '--concurrent', type=int, default=100,
                        help='Maximum number of concurrent requests (default: 100)')
    parser.add_argument('-u', '--url', type=str, 
                        default='https://api.enso.finance/api/v1/networks',
                        help='URL to send requests to')
    args = parser.parse_args()

    print(f"Sending {args.num_requests} requests to {args.url}")
    print(f"Maximum concurrency: {args.concurrent}")
    
    start_time = time.time()
    
    # Run the async function
    results = asyncio.run(send_requests(args.url, args.num_requests, args.concurrent))
    
    end_time = time.time()
    elapsed = end_time - start_time
    
    # Calculate statistics
    success_count = sum(1 for r in results if isinstance(r["status"], int) and 200 <= r["status"] < 300)
    error_count = len(results) - success_count
    
    # Print summary
    print("\nSummary:")
    print(f"Total requests: {len(results)}")
    print(f"Successful responses: {success_count}")
    print(f"Failed responses: {error_count}")
    print(f"Total time: {elapsed:.2f} seconds")
    print(f"Requests per second: {len(results)/elapsed:.2f}")
    
    # Print some error examples if any
    if error_count > 0:
        print("\nSample errors:")
        error_samples = [r for r in results if isinstance(r["status"], str) or r["status"] >= 300][:5]
        for e in error_samples:
            print(f"Request {e['request_id']}: {e['status']}")

if __name__ == "__main__":
    main()