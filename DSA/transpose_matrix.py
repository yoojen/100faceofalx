def per_line_rotate_matrix_90(matrix):
    n = len(matrix)
    new_matrix = [[0] * n for _ in range(len(matrix[0]))]

    for i in range(n):
        for j in range(len(matrix[0])):
            new_matrix[j][n-i-1] = matrix[i][j]

    return new_matrix


def from_bottom_rotate_matrix_90(mat):
    n = len(mat)
    new_mat = [[0]*n for _ in range(len(mat[0]))]

    for i in range(n-1, -1, -1):
        for j in range(len(mat[0])):
            new_mat[j][i] = mat[n-i-1][j]

    return new_mat


if __name__ == "__main__":
    mat = [
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
    ]
    output = per_line_rotate_matrix_90(mat)
    print(output)

    matrix = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
    ]
    output = from_bottom_rotate_matrix_90(matrix)
    print(output)
