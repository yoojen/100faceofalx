def merge_two_sorted_arrays(arr1, arr2):
    a1_size = len(arr1)
    a2_size = len(arr2)
    sorted = [0] * (a1_size+a2_size)
    i = l = r = 0

    while l < a1_size and r < a2_size:
        if arr1[l] < arr2[r]:
            sorted[i] = arr1[l]
            l += 1
            i += 1
        else:
            sorted[i] = arr2[r]
            r += 1
            i += 1

    while l < a1_size:
        sorted[i] = arr1[l]
        l += 1
        i += 1

    while r < a2_size:
        sorted[i] = arr2[r]
        r += 1
        i += 1

    return sorted


if __name__ == "__main__":
    arr1 = [1, 2, 5]
    arr2 = [3, 8, 10]
    output = merge_two_sorted_arrays(arr1, arr2)
    print(output)

    arr1 = [1, 3, 5, 7]
    arr2 = [2, 4, 6, 8]
    output = merge_two_sorted_arrays(arr1, arr2)
    print(output)
