from flask import Flask, jsonify
from celery import Celery, Task
from celery.result import AsyncResult
from tasks import *


def celery_init_app(app: Flask) -> Celery:
    class FlaskTask(Task):
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return self.run.__call__(*args, **kwargs)

    celery_app = Celery(app.name, task_cls=FlaskTask)
    celery_app.config_from_object(app.config["CELERY"])
    celery_app.set_default()
    app.extensions["celery"] = celery_app

    return celery_app


# Initializing Flask application
app = app = Flask(__name__)
app.config["CELERY"] = dict(
    broker_url="redis://localhost",
    result_backend="redis://localhost",
    task_ignore_result=False,
    broker_connection_retry_on_startup=True
)

# Initializing Celery applicaiton
celery = celery_init_app(app)


@app.route("/")
def index():
    result = add.delay(5, 9)
    return jsonify({"result_id": result.id})


@app.get("/result/<id>")
def task_result(id):
    result = AsyncResult(id)
    return jsonify({
        "ready": result.ready(),
        "successful": result.successful(),
        "value": result.result if result.ready() else None,
    })
