def intersect_time(AST, AET, BST, BET):
    if AST >= AET or BST >= BET:
        return None

    ST = max(AST, BST)
    ET = min(AET, BET)

    if ET < ST:
        return False

    return [ST, ET]
