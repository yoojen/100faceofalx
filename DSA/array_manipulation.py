def manipulate_array(array):
    new_array = []
    for i in range(len(array)):
        if i - 1 < 0:
            new_array.append(0 + array[i] + array[i + 1])
        else:
            if i + 1 >= len(array):
                new_array.append(array[i - 1] + array[i] + 0)
            else:
                new_array.append(array[i - 1] + array[i] + array[i + 1])
    return new_array


a = [4, 0, 1, -2, 3]
output = manipulate_array(a)
print(output)
