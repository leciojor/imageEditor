import os
from pathlib import Path

def compare_files(file1, file2):
    """Compare two files byte by byte with detailed feedback"""
    try:
        # Check if both files exist first
        if not os.path.exists(file1):
            print(f"  ❌ File not found: {file1}")
            return False
        if not os.path.exists(file2):
            print(f"  ❌ File not found: {file2}")
            return False
        
        # Compare file sizes first (quick check)
        size1 = os.path.getsize(file1)
        size2 = os.path.getsize(file2)
        
        if size1 != size2:
            print(f"  ❌ File sizes differ: {size1} bytes vs {size2} bytes")
            return False
        
        # Compare content in chunks (memory efficient for large files)
        chunk_size = 8192
        with open(file1, 'rb') as f1, open(file2, 'rb') as f2:
            while True:
                chunk1 = f1.read(chunk_size)
                chunk2 = f2.read(chunk_size)
                
                if chunk1 != chunk2:
                    print(f"  ❌ File contents differ")
                    return False
                
                # If both chunks are empty, we've reached EOF
                if not chunk1:
                    break
        
        return True
        
    except PermissionError as e:
        print(f"  ❌ Permission denied: {e.filename}")
        return False
    except Exception as e:
        print(f"  ❌ Error comparing files: {str(e)}")
        return False
    
def main():
    base_dir = Path("ImageEditorFilesJava")
    curr_results = base_dir / "curr_results"
    key_images = base_dir / "key_images"
    
    if not curr_results.exists():
        print(f"❌ Directory not found: {curr_results}")
        return
    
    if not key_images.exists():
        print(f"❌ Directory not found: {key_images}")
        return
    
    # Get all files in curr_results
    curr_files = sorted([f.name for f in curr_results.glob("*.ppm")])
    
    if not curr_files:
        print("❌ No PPM files found in curr_results")
        return
    
    print(f"Comparing {len(curr_files)} files...\n")
    
    passed = 0
    failed = 0
    missing = 0
    
    for filename in curr_files:
        curr_file = curr_results / filename
        key_file = key_images / filename
        
        print(f"Testing: {filename}")
        
        if not key_file.exists():
            print(f"  ⚠️  Missing key image: {filename}")
            missing += 1
            continue
        
        if compare_files(curr_file, key_file):
            print(f"  ✅ PASS")
            passed += 1
        else:
            print(f"  ❌ FAIL - Files differ")
            failed += 1
        print()
    
    # Summary
    print("=" * 50)
    print(f"SUMMARY:")
    print(f"  ✅ Passed: {passed}")
    print(f"  ❌ Failed: {failed}")
    print(f"  ⚠️  Missing: {missing}")
    print(f"  Total: {len(curr_files)}")
    print("=" * 50)
    
    if failed == 0 and missing == 0:
        print("\n🎉 All tests passed!")
    else:
        print(f"\n⚠️  {failed + missing} test(s) need attention")

if __name__ == "__main__":
    main()