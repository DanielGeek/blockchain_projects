import smartpy as sp


@sp.module
def main():
    class StoreValue(sp.Contract):
        def __init__(self):
            self.data.stored_value = sp.nat(42)

        @sp.entrypoint
        def add(self, added_value):
            self.data.stored_value += added_value

        @sp.entrypoint
        def reset(self):
            self.data.stored_value = 0

        @sp.entrypoint
        def multiply(self, factor):
            self.data.stored_value *= factor
        
@sp.add_test()
def test():
    scenario = sp.test_scenario("Test", main)
    contract = main.StoreValue()
    scenario += contract
    scenario.h3("Testing Add entrypoint")
    contract.add(5)
    scenario.verify(contract.data.stored_value == 47)
    scenario.h3("Testing multiply entrypoint")
    contract.multiply(10)
    scenario.verify(contract.data.stored_value == 470)
