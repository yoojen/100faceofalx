from flask import Blueprint, jsonify, render_template

from celery_modules.mailing.tasks import add, mult, divide

b = Blueprint('test', __name__, '/')


@b.route("/")
def addition():
    result = add.delay(5, 9)
    return jsonify({"result_id": result.id})


@b.route("/mult")
def multiply():
    result = mult.delay(b=6)
    return jsonify({"result_id": result.id})


@b.route("/div")
def division():
    result = divide.delay(1, 0)
    if result:
        return jsonify({"result_id": result.id})
    return jsonify({"result_id": None})


@b.route("/schedule")
def schedule():
    return render_template("schedule.html")
