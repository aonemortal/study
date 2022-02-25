import Vue from 'vue'

import {
    Autocomplete,
    Button, 
    Col, 
    Dialog, 
    Image, 
    Input, 
    Loading, 
    Option, 
    Popconfirm, 
    Popover, 
    Select, 
    TabPane, 
    Tabs, 
    Tree, 
    Upload,
    Progress,
    Checkbox,
    Dropdown,
    DropdownItem,
    DropdownMenu
} from 'element-ui'

const arr = [
    Button,
    Select,
    Option,
    Input,
    Col,
    Tree,
    Popover,
    Upload,
    Progress,
    Dialog,
    Tabs,
    TabPane,
    Image,
    Loading,
    Popconfirm,
    Autocomplete,
    Select,
    Checkbox,
    Dropdown,
    DropdownItem,
    DropdownMenu
]

for (let i = 0; i < arr.length; i++) {
    Vue.use(arr[i])
}