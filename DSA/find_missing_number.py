def find_missing_number(array, n):

    for i in range(n-2):
        if (array[i]+1 != array[i+1]):
            missing = array[i]+1

    return missing


if __name__ == "__main__":
    arr = [1, 2, 3, 4,  6, 7, 8]
    output = find_missing_number(arr, 8)
    print(output)
