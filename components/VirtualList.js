// Licensed under the GNU Affero General Public License v3.0.
// See the LICENCE file in the repository root for full licence text.

// from https://github.com/ppy/osu-web/blob/master/resources/assets/lib/virtual-list/virtual-list.tsx
// removed typescript and mobx

import { throttle } from "lodash";
import * as React from "react";

const emptyItemBounds = { firstItemIndex: 0, lastItemIndex: 0 };

function topFromWindow(element) {
  if (element == null) return 0;

  const offsetTop = "offsetTop" in element ? element.offsetTop : 0;
  const offsetParent = "offsetParent" in element ? element.offsetParent : null;

  return offsetTop + topFromWindow(offsetParent);
}

export default class VirtualList extends React.Component {
  static defaultProps = {
    itemBuffer: 0,
  };

  get visibleItemBounds() {
    const length = this.props.items.length;
    const viewHeight = this.scrollContainer.innerHeight;

    if (length === 0 || viewHeight === 0) return emptyItemBounds;

    const { itemBuffer, itemHeight } = this.props;
    const scrollBottom = this.state.scrollTop + viewHeight;

    const listTop = topFromWindow(this.ref.current) - topFromWindow(this.scrollContainer); // top of the list inside the scroll container
    const listHeight = itemHeight * length;

    // visible portion of the list
    const listViewTop = Math.max(0, this.state.scrollTop - listTop);
    const listViewBottom = Math.max(0, Math.min(listHeight, scrollBottom - listTop));

    // visible item indexes
    const firstItemIndex = Math.max(0, Math.floor(listViewTop / itemHeight) - itemBuffer);
    const lastItemIndex = Math.min(length, Math.ceil(listViewBottom / itemHeight) + itemBuffer);

    return {
      firstItemIndex,
      lastItemIndex,
    };
  }

  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.scrollContainer = window; // we only care about window for now.
    this.state = {
      scrollTop: 0,
    };
    this.throttledSetScroll = throttle(() => this.setScroll(), 10);
  }

  componentDidMount() {
    this.scrollContainer.addEventListener("scroll", this.throttledSetScroll);
  }

  componentWillUnmount() {
    this.scrollContainer.removeEventListener("scroll", this.throttledSetScroll);
  }

  render() {
    const visibleItemBounds = this.visibleItemBounds;
    const items =
      visibleItemBounds.lastItemIndex > 0
        ? this.props.items.slice(visibleItemBounds.firstItemIndex, visibleItemBounds.lastItemIndex)
        : [];

    const style = {
      boxSizing: "border-box",
      height: this.props.items.length * this.props.itemHeight,
      paddingTop: visibleItemBounds.firstItemIndex * this.props.itemHeight,
    };

    return (
      <div ref={this.ref} style={style}>
        {this.props.children({ items })}
      </div>
    );
  }
  setScroll = () => {
    this.setState({ scrollTop: this.scrollContainer.scrollY });
  };
}
