from celery import shared_task


@shared_task
def add(a, b):
    return a + b


@shared_task(bind=True, autoretry_for=(ZeroDivisionError,),
             retry_kwargs={'max_retries': 3})
def divide(self, a, b):
    try:
        return a / b
    except Exception as exc:
        self.retry(exc=exc, countdown=5)


@shared_task
def mult(a=12, b=0):
    return a*b
