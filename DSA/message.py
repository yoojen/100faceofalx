def manipulate_message(message, n):
    message = list(message)
    founds = []
    vowels = ['a', 'e', 'i', 'o', 'u']
    consonants = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l',
                  'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'y', 'z']
    count = 0

    for char in message:
        if (char.lower() in consonants):
            count += 1
            if (count != 0 and count % n == 0):
                founds.append(char)

    try:
        for char in founds:
            index = message.index(char)
            c_index = consonants.index(char.lower())
            if message[index].islower():
                message[index] = consonants[c_index+1]
            else:
                message[index] = consonants[c_index+1].upper()
    except Exception:
        if message[index].islower():
            message[index] = consonants[0]
        else:
            message[index] = consonants[0].upper()
    return "".join(message)


print(manipulate_message("CodeSignal", 3))
