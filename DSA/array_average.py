def find_array_average(array):
    num = len(array)
    total = sum(array)
    return total/num


if __name__ == '__main__':
    arr = [2, 3, 4, 5, 6]
    output = find_array_average(arr)
    print(output)
