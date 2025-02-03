def find_array_mean(array, total=0, count=1):
    n = len(array)
    if n < 1:
        return
    if n == 1:
        return (total + array[n-1])/count
    total += array[-1]
    return find_array_mean(array[:-1], total, count+1)


def find_array_sum(array):
    if len(array) < 2:
        return
    print(array)
    return find_array_sum(array[:-1])


if __name__ == "__main__":
    # print(find_array_mean([100, 400, 10, 500, 600]))
    print(find_array_sum([100, 400, 10, 500, 600]))
