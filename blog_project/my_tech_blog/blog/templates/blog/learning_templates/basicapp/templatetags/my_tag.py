from django import template

register = template.Library()

@register.filter(name='cut')
def cut(value, arg):
    """
    This is a filter that removes the arg from value.
    """
    return value.replace(arg,"")


# register.filter('cut',cut)
