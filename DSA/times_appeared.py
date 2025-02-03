def times_appeared(string):
    unique_characters = {}
    for char in string:
        if not unique_characters.get(char):
            unique_characters[char] = 1
        else:
            unique_characters[char] += 1
    return unique_characters


def merge_strings(string_1, string_2):
    new_string = ""
    appeared_1 = times_appeared(string_1)
    appeared_2 = times_appeared(string_2)

    i = j = 0
    while i < len(string_1) and j < len(string_2):
        if appeared_1[string_1[i]] < appeared_2[string_2[j]]:
            new_string += string_1[i]
            i += 1
        elif appeared_1[string_1[i]] > appeared_2[string_2[j]]:
            new_string += string_2[j]
            j += 1
        else:
            if string_1[i] < string_2[j]:
                new_string += string_1[i]
                i += 1
            elif string_1[i] > string_2[j]:
                new_string += string_2[j]
                j += 1
            else:
                new_string += string_1[i]
                i += 1
    while i < len(string_1):
        new_string += string_1[i]
        i += 1
    while j < len(string_2):
        new_string += string_2[j]
        j += 1
    return new_string


if __name__ == "__main__":
    print(merge_strings("aabb", "ccdd"))
    print(merge_strings("xxyy", "xyzz"))
