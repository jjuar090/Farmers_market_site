import pandas as pd
def the_thing(filename):
    df = pd.read_csv(filename)
    img_links = df['page_url'].values.tolist()
    the_image = img_links[0];
    return the_image