def sum_digits(number):
    sum = 0
    for digit in str(number):
        sum += int(digit)
    return sum


def recursively_sum_digits(number):
    if number == 0 or number == 1:
        return number
    n = number
    remainder = n % 10

    return remainder + recursively_sum_digits(n // 10)


if __name__ == "__main__":
    n = 8791
    output = recursively_sum_digits(n)
    print(output)

    output = sum_digits(n)
    print(output)
