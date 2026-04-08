package com.ppr.web.dto;

import java.util.ArrayList;
import java.util.List;

public class DirTreeNode {
    private String name;
    private String path;
    private List<DirTreeNode> children;

    public DirTreeNode(String name, String path) {
        this.name = name;
        this.path = path;
        this.children = new ArrayList<>();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public List<DirTreeNode> getChildren() {
        return children;
    }

    public void setChildren(List<DirTreeNode> children) {
        this.children = children;
    }
}
