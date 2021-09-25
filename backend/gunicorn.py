import multiprocessing

reload = True
wsgi_app = "config.wsgi:application"
bind = "0.0.0.0:8000"
worker_class = "gevent"
workers = multiprocessing.cpu_count() * 2 + 1
threads = multiprocessing.cpu_count() * 2 + 1