def factorization(number):
    # print("Received", number)
    if (number != int(number) or number == 0):
        return False
    if number == 1:
        return True
    return factorization(number / 2)


def lookup_table(array):
    count = 0
    for i in range(len(array)):
        for j in range(len(array)):
            if i <= j:
                if factorization(array[i] + array[j]):
                    count += 1

    return count


numbers = [1, -1, 2, 3]
output = lookup_table(numbers)
print(f'Output 1-> {output}')

numbers = [-2, -1, 0, 1, 2]
output = lookup_table(numbers)
print(f'Output 2-> {output}')
