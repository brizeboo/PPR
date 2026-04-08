package com.ppr.infra.file;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class FileStorageService {

    @Value("${ppr.file.storage-path:./ppr-files}")
    private String storagePath;

    private Path rootLocation;

    @PostConstruct
    public void init() {
        this.rootLocation = Paths.get(storagePath).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage location", e);
        }
    }

    private Path resolveAndCheckPath(String relativePath) {
        if (relativePath == null) {
            relativePath = "";
        }
        // Normalize the path to prevent directory traversal
        Path resolvedPath = this.rootLocation.resolve(relativePath).normalize().toAbsolutePath();
        if (!resolvedPath.startsWith(this.rootLocation)) {
            throw new SecurityException("Cannot access path outside of current directory: " + relativePath);
        }
        return resolvedPath;
    }

    public Path load(String relativePath) {
        return resolveAndCheckPath(relativePath);
    }

    public List<Path> getTree() throws IOException {
        try (Stream<Path> stream = Files.walk(this.rootLocation)) {
            return stream.filter(Files::isDirectory)
                         .collect(Collectors.toList());
        }
    }

    public void createDirectory(String relativePath, String dirName) throws IOException {
        if (!StringUtils.hasText(dirName) || dirName.contains("/") || dirName.contains("\\")) {
            throw new IllegalArgumentException("Invalid directory name");
        }
        Path parentPath = resolveAndCheckPath(relativePath);
        Path newDirPath = parentPath.resolve(dirName);
        if (!newDirPath.normalize().toAbsolutePath().startsWith(this.rootLocation)) {
            throw new SecurityException("Cannot create directory outside of storage");
        }
        Files.createDirectories(newDirPath);
    }

    public void renameDirectory(String relativePath, String newDirName) throws IOException {
        if (!StringUtils.hasText(newDirName) || newDirName.contains("/") || newDirName.contains("\\")) {
            throw new IllegalArgumentException("Invalid directory name");
        }
        Path dirToRename = resolveAndCheckPath(relativePath);
        if (dirToRename.equals(this.rootLocation)) {
            throw new IllegalArgumentException("Cannot rename root directory");
        }
        Path newDirPath = dirToRename.getParent().resolve(newDirName);
        Files.move(dirToRename, newDirPath, StandardCopyOption.REPLACE_EXISTING);
    }

    public void deleteDirectory(String relativePath) throws IOException {
        Path dirToDelete = resolveAndCheckPath(relativePath);
        if (dirToDelete.equals(this.rootLocation)) {
            throw new IllegalArgumentException("Cannot delete root directory");
        }
        if (!Files.isDirectory(dirToDelete)) {
            throw new IllegalArgumentException("Path is not a directory");
        }
        try (Stream<Path> entries = Files.list(dirToDelete)) {
            if (entries.findFirst().isPresent()) {
                throw new IllegalStateException("Directory is not empty");
            }
        }
        Files.delete(dirToDelete);
    }

    public List<Path> listFiles(String relativePath) throws IOException {
        Path dirPath = resolveAndCheckPath(relativePath);
        if (!Files.isDirectory(dirPath)) {
            throw new IllegalArgumentException("Path is not a directory");
        }
        try (Stream<Path> stream = Files.list(dirPath)) {
            return stream.filter(Files::isRegularFile).collect(Collectors.toList());
        }
    }

    public void store(MultipartFile file, String relativePath) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Failed to store empty file.");
        }
        Path dirPath = resolveAndCheckPath(relativePath);
        if (!Files.isDirectory(dirPath)) {
            Files.createDirectories(dirPath);
        }
        Path destinationFile = dirPath.resolve(Paths.get(file.getOriginalFilename()))
                .normalize().toAbsolutePath();
        if (!destinationFile.getParent().equals(dirPath.toAbsolutePath())) {
            throw new SecurityException("Cannot store file outside current directory.");
        }
        try (var inputStream = file.getInputStream()) {
            Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
        }
    }

    public void deleteFile(String relativePath) throws IOException {
        Path fileToDelete = resolveAndCheckPath(relativePath);
        if (!Files.isRegularFile(fileToDelete)) {
            throw new IllegalArgumentException("Path is not a file");
        }
        Files.delete(fileToDelete);
    }

    public Path getRootLocation() {
        return rootLocation;
    }
}
