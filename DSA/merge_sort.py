def merge(left_array, right_array, sorted):
    left_size = len(left_array)
    right_size = len(right_array)
    i = l = r = 0

    while l < left_size and r < right_size:
        if left_array[l] < right_array[r]:
            sorted[i] = left_array[l]
            i += 1
            l += 1
        else:
            sorted[i] = right_array[r]
            i += 1
            r += 1
    while l < left_size:
        sorted[i] = left_array[l]
        i += 1
        l += 1
    while r < right_size:
        sorted[i] = right_array[r]
        i += 1
        r += 1


def split_arrays(array):
    if len(array) <= 1:
        return
    mid = len(array)//2 if len(array) % 2 == 0 else len(array)//2 + 1
    left_array = array[:mid]
    right_array = array[mid:]

    # print(left_array, right_array)
    split_arrays(left_array)
    split_arrays(right_array)
    print(f"Sending this array {array}")
    merge(left_array, right_array, array)

    print(array)


arr = [7, 6, 5, 4, 3, 2, 9]
split_arrays(arr)
