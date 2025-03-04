from flask import Flask
from celery import Celery, Task
from celery.worker.request import Request

from celery_modules.calendaring import tasks
from celery_modules.mailing import tasks
from automation.routes import b


def flask_init_app():
    flask_app = Flask(__name__)
    flask_app.config["CELERY"] = dict(
        broker_url="redis://localhost:6379/0",
        task_ignore_result=True,
        broker_connection_retry_on_startup=True
    )

    return flask_app


def celery_init_app(app) -> Celery:
    class FlaskTask(Task):
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return self.run.__call__(*args, **kwargs)

    celery_app = Celery(__name__, task_cls=FlaskTask)
    celery_app.config_from_object(app.config["CELERY"])
    celery_app.set_default()
    app.extensions["celery"] = celery_app

    return celery_app


# Initializing Flask application
flask_app = flask_init_app()

# Initializing Celery applicaiton
celery_app = celery_init_app(flask_app)

flask_app.register_blueprint(b)
