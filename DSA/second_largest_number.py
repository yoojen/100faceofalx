def find_second_largest_number(array):
    largest = array[0]
    second_largest = array[0]
    for i in range(len(array)):
        if array[i] > largest:
            largest = array[i]

    for i in range(len(array)):
        if array[i] > second_largest and array[i] != largest:
            second_largest = array[i]
    return second_largest


output = find_second_largest_number([32, 54, 212, 65, 234, 643])
print(output)
