def print_one_to_n(i=1):
    if i <= 100:
        print(i, end=" ")
        i += 1
        print_one_to_n(i)


print_one_to_n()
