# CHANGES

## 2022/08/17

- New data-* attributes to set text colors and background colors for individual nodes: *data-nonHoverColor,
  data-nonHoverColor_bg, data-HoverColor, data-HoverColor_bg*.

## 2022/03/25

- New method: disableParentNodeOnCollapse
- New events: nodeCollapsed and nodeExpanded 

## 2022/03/11

- The "2. Simple pseudo HTML plus ..." input format has now an additional parameter *data-css*
  to inject arbitrary CSS.

## 2022/02/24

- Support special characters in "vals" for the methods. For instance a "|" or a "," in 
  ```javascript
  $("#treeview").hummingbird('checkNode',{sel:"data-id",vals:["test1|test2","a,b"]});
  ```

## 2021/06/01

- Big upgrade to mass assignments. If you have used the treeview only
  interactively, no change needed. However, if you have used it
  programatically with respective methods, you have to change your syntax and concept!

## 2021/02/09

- Bugfix on disable/enable functionality

## 2021/02/09

- New method skipCheckUncheckDone

## 2021/02/05

- Remove the div with class hummingbird-treeview-converter after finalising 
  initialization

## 2021/02/04

- New methods, saveState and restoreState, getIndeterminate

## 2021/01/12

- New feature data-str.

## 2021/01/12

- New methods hide / show.

## 2020/11/19

- Some bug fixes regarding disabled nodes.

## 2020/10/23

- npm package made available

## 2020/10/22

- bug fix, disabled nodes changed color on hover, now disabled nodes do not react on hover

## 2020/09/27

- new data-* attribute for setting parents font to bold 

## 2020/06/29

- data-id added to div class="hummingbird-treeview-converter" to set individual id's to address the treeview e.g. via $("#treeview_movies").hummingbird();

## 2020/03/31

- hummingbird-treeview resources now available via cdn.jsdelivr.net

## 2020/03/15

- [Test on JSFiddle](https://jsfiddle.net/hummingbird_dev/1s9qy6dh/17/) 

## 2020/03/03

- New method: disableToggle

## 2020/03/03

- New option: clickGroupsToggle 

## 2020/01/30

- New option: Customizable hover effect.

## 2019/12/22

- Add on functions: *select-single-node* and *select-single-group*.

## 2019/12/22

- New section "Add on options and functionality".

## 2019/12/04

- New option *singleGroupOpen* to allow only one group to be open and collapse all others.

## 2019/08/31

- Implementation of case-insensitive filter search as default with ability to override. Thanks to Mrkbingham.

## 2019/04/30

- Now Font-Awesome 5 is supported, see documentation how to use it.














