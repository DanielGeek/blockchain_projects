import smartpy as sp

@sp.module
def main():

    class Verification(sp.Contract):
        def __init__(self):
            self.data.stored_value = 0

        @sp.entry_point
        def add(self, added_value):
            assert added_value >= 0 and added_value < 10, "Not between 0 and 9"
            self.data.stored_value += added_value

@sp.add_test()
def test():
    scenario = sp.test_scenario("Test add", main)
    c1 = main.Verification()
    scenario += c1
    scenario.h3("Testing add entrypoint")
    c1.add(1)
    c1.add(9)
    scenario.verify(c1.data.stored_value == 10)
    c1.add(-5, _valid = False)
    c1.add(10, _valid = False)
