services:
  - type: web
    name: digit-app
    env: python
    buildCommand: "pip install -r requirements.txt"
    startCommand: "gunicorn app:app --timeout 120"
    plan: free
