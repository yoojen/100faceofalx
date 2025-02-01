
def check_prime_numbers(array):
    primes = []
    found = False
    for i in range(len(array)):
        if array[i] == 1 or array[i] == 2:
            primes.append(array[i])
            continue
        if array[i] % 2 == 0:
            continue
        for j in range(3, int(array[i]**0.5) + 1, 2):
            if array[i] % j == 0:
                found = True

        if not found:
            primes.append(array[i])

    return primes


output = check_prime_numbers(
    [32, 12, 5, 55, 67, 17, 3, 667, 1, 7, 13, 169, 653, 78])
print(output)
