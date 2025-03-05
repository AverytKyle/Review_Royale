from flask.cli import AppGroup
from .users import seed_users, undo_users
from .businesses import seed_businesses, undo_businesses
from .reviews import seed_reviews, undo_reviews
from .images import seed_images, undo_images
from .businessCat import seed_businessCat, undo_businessCat
from .categories import seed_category, undo_category
from .reviewConnections import seed_review_connections, undo_review_connections

from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo 
        # command, which will  truncate all tables prefixed with 
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_users()
        undo_businesses()
        undo_reviews()
        undo_images()
        undo_category()
        undo_businessCat()
        undo_review_connections()
    seed_users()
    seed_businesses()
    seed_reviews()
    seed_images()
    seed_category()
    seed_businessCat()
    seed_review_connections()


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_users()
    undo_businesses()
    undo_reviews()
    undo_images()
    undo_category()
    undo_businessCat()
    undo_review_connections()