def is_vowel(char):
    vowels = ['e', 'u', 'i', 'o', 'a', 'y']
    return char in vowels


def differentiate(pattern, substring):
    if len(substring) < len(pattern):
        return 0
    for i in range(len(substring)):
        if (pattern[i] == '1' and is_vowel(substring[i])) \
                or (pattern[i] == "0" and not is_vowel(substring[i])):
            count = 0
            break
        else:
            count = 1
    return count


def string_pattern_match(pattern, string):
    str_n = len(string)
    pat_n = len(pattern)
    matches = 0

    if str_n > 1e3:
        return None
    for i in range(str_n):
        substring = string[i:i+pat_n]
        matches += differentiate(pattern, substring)
    return matches


pattern = "010"
source = "amazing"
output = string_pattern_match(pattern, source)
print(output)


pattern = "100"
source = "codesignal"
output = string_pattern_match(pattern, source)
print(output)

pattern = "101"
source = "codesignal"
output = string_pattern_match(pattern, source)
print(output)


pattern = "1011"
source = "codesignal"
output = string_pattern_match(pattern, source)
print(output)
