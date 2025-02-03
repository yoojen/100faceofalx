class Queue:
    def __init__(self, size):
        self.__queue = []
        self.queue_size = size

    def enqueue(self, value):
        if self.is_full:
            return None
        self.__queue.append(value)
        return self.__queue

    def dequeue(self):
        if self.is_empty:
            return None
        self.__queue.remove(self.__queue[0])
        return self.__queue

    def peek(self):
        pass

    def rear(self):
        pass

    @property
    def is_full(self):
        print(len(self.__queue) >= self.size
              )
        return len(self.__queue) >= self.size

    @property
    def is_empty(self):
        pass

    @property
    def size(self):
        return self.queue_size

    def __str__(self):
        return f"{self.__queue}"


if __name__ == "__main__":
    queue = Queue(5)
    queue.enqueue(1)
    queue.enqueue(2)
    queue.enqueue(3)
    queue.enqueue(4)
    print(queue)
    # queue.dequeue()
    # print(queue)
