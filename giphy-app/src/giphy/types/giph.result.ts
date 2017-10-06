export type Giph = {
  images: {
    original: {
      url: string,
      width: string,
      height: string
    }
  }
};

export namespace GiphBuilder {
  export function buildGiph({
                              images = {
                                original: {url: '', width: '', height: ''}
                              },
                            }): Giph {
    return {
      images
    };
  }
}
