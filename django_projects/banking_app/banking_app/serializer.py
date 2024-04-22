
class Serializer:
    @staticmethod
    def dumps(model):
        dumped_model = dict(model.__dict__)
        del dumped_model["_state"]
        return dumped_model