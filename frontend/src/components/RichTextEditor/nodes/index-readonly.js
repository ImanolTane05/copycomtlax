/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
*/

import {CodeHighlightNode, CodeNode} from '@lexical/code';
import {AutoLinkNode, LinkNode} from '@lexical/link';
import {ListItemNode, ListNode} from '@lexical/list';
import {MarkNode} from '@lexical/mark';
import {OverflowNode} from '@lexical/overflow';
import {HorizontalRuleNode} from '@lexical/react/LexicalHorizontalRuleNode';
import {HeadingNode, QuoteNode} from '@lexical/rich-text';
import {TableNode, TableCellNode, TableRowNode} from '@lexical/table';

// Descomentar al crear nodos
//import {EmojiNode} from './EmojiNode'
import {InlineImageNode} from './ReadOnlyInlineImageNode';
//import {TweetNode} from './TweetNode'
//import {YouTubeNode} from './YouTubeNode'

const Nodes=[
    CodeNode,
    CodeHighlightNode,
    //EmojiNode,
    HeadingNode,
    HorizontalRuleNode,
    InlineImageNode,
    AutoLinkNode,
    LinkNode,
    ListNode,
    ListItemNode,
    MarkNode,
    OverflowNode,
    QuoteNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    //TweetNode,
    //YouTubeNode,
];

export default Nodes;