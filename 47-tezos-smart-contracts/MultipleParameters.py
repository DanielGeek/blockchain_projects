import smartpy as sp

@sp.module
def main():

    class MultipleParameters(sp.Contract):
        def __init__(self, min_value, max_value):
            self.data.min_value = sp.cast(min_value, sp.int)
            self.data.max_value = max_value

        @sp.entrypoint
        def set(self, new_min_value, new_max_value):
            self.data.min_value = new_min_value
            self.data.max_value = new_max_value

        @sp.entrypoint
        def add_number(self, a):
            self.data.min_value += a
            self.data.max_value += a

@sp.add_test()
def test():
    scenario = sp.test_scenario("Test MultipleParameters", main)
    c1 = main.MultipleParameters(min_value=0, max_value=100)
    scenario += c1
    
    scenario.h3("Testing set entrypoint")
    c1.set(new_min_value=10, new_max_value=90)
    scenario.verify(c1.data.min_value == 10)
    scenario.verify(c1.data.max_value == 90)

    scenario.h3("Testing add_number entrypoint")
    c1.add_number(5)
    scenario.verify(c1.data.min_value == 15)
    scenario.verify(c1.data.max_value == 95)

    c1.add_number(-5)
    scenario.verify(c1.data.min_value == 10)
    scenario.verify(c1.data.max_value == 90)
