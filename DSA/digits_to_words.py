def digits_to_words(digits):
    # convert number into string
    # split the string
    # convert the single element into digit with its corresponding text value
    initial_value = []
    word_dict = {
        '0': 'Zero', '1': 'One', '2': 'Two',
        '3': 'Three', '4': 'Four',  '5': 'Five',
        '6': 'Six',  '7': 'Seven',  '8': 'Eight', '9': 'Nine'
    }

    digits_string = str(digits)
    for digit in digits_string:
        print(word_dict[digit], end=" ")
    print()


if __name__ == '__main__':
    N = 1234
    digits_to_words(N)
    N = 567
    digits_to_words(N)
