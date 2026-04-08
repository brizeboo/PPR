package com.ppr.web.controller;

import com.ppr.infra.file.FileStorageService;
import com.ppr.web.dto.DirTreeNode;
import com.ppr.web.dto.FileInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin/file")
public class FileAdminController {

    @Autowired
    private FileStorageService fileStorageService;

    // --- Directory Management ---

    @GetMapping("/dir/tree")
    public DirTreeNode getDirTree() throws IOException {
        Path root = fileStorageService.getRootLocation();
        return buildTree(root, root);
    }

    private DirTreeNode buildTree(Path current, Path root) throws IOException {
        String relativePath = root.relativize(current).toString().replace("\\", "/");
        if (relativePath.isEmpty()) {
            relativePath = "/";
        } else {
            relativePath = "/" + relativePath;
        }
        
        DirTreeNode node = new DirTreeNode(current.getFileName() != null ? current.getFileName().toString() : "root", relativePath);
        
        try (var stream = Files.list(current)) {
            List<DirTreeNode> children = stream.filter(Files::isDirectory)
                    .map(child -> {
                        try {
                            return buildTree(child, root);
                        } catch (IOException e) {
                            throw new RuntimeException(e);
                        }
                    })
                    .collect(Collectors.toList());
            node.setChildren(children);
        }
        return node;
    }

    @PostMapping("/dir/create")
    public Map<String, Object> createDir(@RequestParam("path") String path, @RequestParam("name") String name) throws IOException {
        fileStorageService.createDirectory(path, name);
        Map<String, Object> resp = new HashMap<>();
        resp.put("success", true);
        return resp;
    }

    @PutMapping("/dir/rename")
    public Map<String, Object> renameDir(@RequestParam("path") String path, @RequestParam("newName") String newName) throws IOException {
        fileStorageService.renameDirectory(path, newName);
        Map<String, Object> resp = new HashMap<>();
        resp.put("success", true);
        return resp;
    }

    @DeleteMapping("/dir/delete")
    public Map<String, Object> deleteDir(@RequestParam("path") String path) throws IOException {
        fileStorageService.deleteDirectory(path);
        Map<String, Object> resp = new HashMap<>();
        resp.put("success", true);
        return resp;
    }

    // --- File Management ---

    @GetMapping("/list")
    public Map<String, Object> listFiles(
            @RequestParam(value = "path", defaultValue = "/") String path,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) throws IOException {
        
        List<Path> allFiles = fileStorageService.listFiles(path);
        int total = allFiles.size();
        
        List<FileInfo> fileInfos = allFiles.stream()
                .skip((long) (page - 1) * size)
                .limit(size)
                .map(p -> {
                    try {
                        String relPath = fileStorageService.getRootLocation().relativize(p).toString().replace("\\", "/");
                        if (!relPath.startsWith("/")) relPath = "/" + relPath;
                        return new FileInfo(
                                p.getFileName().toString(),
                                Files.size(p),
                                Files.getLastModifiedTime(p).toMillis(),
                                relPath
                        );
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                })
                .collect(Collectors.toList());

        Map<String, Object> resp = new HashMap<>();
        resp.put("records", fileInfos);
        resp.put("total", total);
        resp.put("page", page);
        resp.put("size", size);
        return resp;
    }

    @PostMapping("/upload")
    public Map<String, Object> uploadFile(@RequestParam("file") MultipartFile file, @RequestParam("path") String path) throws IOException {
        fileStorageService.store(file, path);
        Map<String, Object> resp = new HashMap<>();
        resp.put("success", true);
        return resp;
    }

    @GetMapping("/download")
    public ResponseEntity<Resource> downloadFile(@RequestParam("path") String path) throws IOException {
        Path file = fileStorageService.load(path);
        Resource resource = new UrlResource(file.toUri());
        
        if (resource.exists() || resource.isReadable()) {
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/delete")
    public Map<String, Object> deleteFile(@RequestParam("path") String path) throws IOException {
        fileStorageService.deleteFile(path);
        Map<String, Object> resp = new HashMap<>();
        resp.put("success", true);
        return resp;
    }
}
