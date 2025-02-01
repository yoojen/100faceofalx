def count_odd_even(array):
    total_evens = total_odds = 0

    if len(array) <= 0:
        return None
    for i in array:
        if i % 2 == 0:
            total_evens += 1
        elif not (i % 2 == 0):
            total_odds += 1
    return total_odds, total_evens


if __name__ == '__main__':
    arr = [2, 3, 4, 5, 6]
    output = count_odd_even(arr)
    output = count_odd_even(arr)
    print(output)
    arr_2 = [22, 32, 42, 52, 62]
    output_2 = count_odd_even(arr_2)
    print(output_2)
