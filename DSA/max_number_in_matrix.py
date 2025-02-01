import sys


def find_max_number_in_matrix(matrix):
    maxNumber = -sys.maxsize-1
    for i in range(len(matrix)):
        for j in range(len(matrix[0])):
            if matrix[i][j] > maxNumber:
                maxNumber = matrix[i][j]
    return maxNumber


if __name__ == '__main__':
    mat = [[1, 2, 3, 4],
           [25, 6, 7, 8],
           [9, 10, 11, 12],
           [13, 14, 15, 16]]
    output = find_max_number_in_matrix(mat)
    print(output)
