from hypothesis import given
from hypothesis.strategies import floats, lists


def intersect_time(AST, AET, BST, BET):
    if AST >= AET or BST >= BET:
        return "wrong precondition"

    ST = max(AST, BST)
    ET = min(AET, BET)

    if ET < ST:
        return "not intersected"

    return [ST, ET]


@given(lists(floats(min_value=0, max_value=24), min_size=4, max_size=4).filter(lambda x: x[0] < x[1] and x[2] < x[3]))
def test_intersect_time(f_list):
    AST, AET, BST, BET = f_list
    intersect = intersect_time(AST, AET, BST, BET)
    print(f"A: {AST:.1f}, {AET:.1f}, B: {BST:.1f} {BET:.1f}, {intersect}\n")
