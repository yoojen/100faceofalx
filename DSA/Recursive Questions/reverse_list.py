def reverse_list(left, right, array):
    if not left < right:
        return array
    array[left], array[right] = array[right], array[left]

    return reverse_list(left + 1, right - 1, array)


array = [3, 2, 1]
output = reverse_list(0, len(array) - 1, array)
print(output)
array = [3, 2, 1, 0]
output = reverse_list(0, len(array) - 1, array)
print(output)
