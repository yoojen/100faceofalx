def paranthesis_checker(string):
    stack = []
    valid_paranthesis = {
        "(": ")",
        "[": "]",
        "{": "}"
    }
    for s in string:
        if s in valid_paranthesis.keys():
            stack.append(s)
        else:
            popped = stack.pop()
            if valid_paranthesis[popped] != s:
                return False
    return len(stack) == 0


if __name__ == "__main__":
    s = "[{([])}]"
    print(paranthesis_checker(s))
