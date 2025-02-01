def is_number_perfect_square(number):
    sqrt = number ** 0.5
    if int(sqrt) == sqrt:
        return "Yes"
    return 'No'


def is_number_perfect_square_bs(n):
    if n <= 1:
        return "Yes"

    left = 1
    right = n
    while left <= right:
        mid = left + ((right-left) >> 1)
        square = mid * mid

        if square == n:
            return "Yes"
        elif square < n:
            left = mid + 1
        else:
            right = mid - 1

    return "No"


if __name__ == '__main__':
    n = 36
    output = is_number_perfect_square(n)
    output_bs = is_number_perfect_square_bs(n)
    print(output)
    print(output_bs)

    n = 169
    output = is_number_perfect_square(n)
    output_bs = is_number_perfect_square_bs(n)
    print(output)
    print(output_bs)

    n = 250
    output = is_number_perfect_square(n)
    output_bs = is_number_perfect_square_bs(n)
    print(output)
    print(output_bs)
