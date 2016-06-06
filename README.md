# tung.pagination.js
The pagination plug-in for my site

# Usage
## import Jquery.js
version 2.0 above recommended
```
<script src="jquery-2.1.4.min.js"></script>
```
## import styles.css and tung.pagination.js
```
<link type="text/css" rel="stylesheet" href="styles.css" />
<script src="tung.pagination.js"></script>
```
## HTML
```
<div id="mypagination"></div>
```
## script
```
<script>
  new TungPagination("#mypagination",{
    _type: "normal",
    pageSum: 10,
    curPage: 1,
    toPage: function(toPage, baseUrl){
      
    }
  })
</script>
```

# Options API
| Name | Type | Default | Options |
| --- | --- | --- | --- |
| _type | String | "simple" | "simple","normal","full" |
| pageSum | Number | 1 | Number greater than 0 |
| curPage | Number | 1 | Number greater than 0, less than pageSum mentioned above |
| baseUrl | String | "" | It's optional. |
| showWidth | Number | 5 | Effective when _type is "normal" or "full" |
