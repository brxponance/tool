---
created: 2026-05-11T13:08:11 (UTC -04:00)
tags: []
source: https://fpe.factset.com/docs/files.html
author: 
---

# Files — FactSet Programmatic

> ## Excerpt
> The fds.fpe.files module is used to manipulate files in the FactSet Client and Personal directories.
This includes moving and copying files in between both file types as well as opening files for editing
with packages such as pandas.

---
The _fds.fpe.files_ module is used to manipulate files in the FactSet Client and Personal directories. This includes moving and copying files in between both file types as well as opening files for editing with packages such as pandas.

## Functions[#](https://fpe.factset.com/docs/files.html#functions "Link to this heading")

**Open and read a text file**

```
from fds.fpe.files import open as openfile

with openfile("example.txt", "r") as f:
    print(f.read())
```

**Open Excel and CSV files**

```
import pandas as pd
from fds.fpe.files import open as openfile

# Open an Excel Workbook
with openfile("example.xlsx", "rb") as f:
    df = pd.read_excel(f)

# Open a CSV file
with openfile("example.csv", "rb") as f:
    df = pd.read_csv(f)
```

fds.fpe.files.open(_path_, _mode\='r'_, _encoding\=None_, _newline\=None_)[#](https://fpe.factset.com/docs/files.html#fds.fpe.files.open "Link to this definition")

Open a file.

This function creates a File Like object for the specified file path with the given mode, encoding, and newline settings.

Parameters:

-   **path** (_str_) – Path to the file to open. This can be a path to a file in the local filesystem or a client-level file.
    
-   **mode** (_str__,_ _optional_) – Mode to open the file in, by default “r”. Valid modes are: - “r”: Read (default) - “w”: Write (truncate the file if it exists) - “a”: Append (write to the end of the file if it exists) - “x”: Create (fail if the file exists) - “t”: Text mode (default) - “b”: Binary mode Note: Modes can be combined, e.g., “rb” for reading in binary mode.
    
-   **encoding** (_str__,_ _optional_) – Encoding to use for text mode, by default the system’s locale encoding. This parameter is ignored in binary mode.
    
-   **newline** (_str__,_ _optional_) – Newline to use for text mode, by default None. This parameter is ignored in binary mode.
    

Returns:

A file like object that provides an interface for file operations.

Return type:

File Like Object

Raises:

-   **ValueError** – If the mode is not valid or if conflicting modes are specified.
    
-   **FileExistsError** – If the mode is “x” (create) and the file already exists.
    
-   **FileNotFoundError** – If the mode is “r” (read) and the file does not exist.
    
-   **IOError** – If there is an error creating or initializing the file.
    

Note

The functions open and openfile are identical and interchangeable.

fds.fpe.files.copy(_src_, _dst_)[#](https://fpe.factset.com/docs/files.html#fds.fpe.files.copy "Link to this definition")

Copy files within and between Personal and Client directory.

Parameters:

-   **src** (_str_) – Source filename, including path, of the file to be copied. Client directory file paths must be absolute, otherwise relative.
    
-   **dst** (_str_) – Destination filename, including path, of the file to be copied. Client directory file paths must be absolute, otherwise relative. Any missing directories will be created.
    

Return type:

`None`

fds.fpe.files.move(_src_, _dst_)[#](https://fpe.factset.com/docs/files.html#fds.fpe.files.move "Link to this definition")

Move files within and between Personal and Client directory.

Parameters:

-   **src** (_str_) – Source filename, including path, of the file to be moved. Client directory file paths must be absolute, otherwise relative.
    
-   **dst** (_str_) – Destination filename, including path, of the file to be moved. Client directory file paths must be absolute, otherwise relative. Any missing directories will be created.
    

Return type:

`None`

fds.fpe.files.remove(_path_)[#](https://fpe.factset.com/docs/files.html#fds.fpe.files.remove "Link to this definition")

Remove a file in a directory.

Parameters:

**path** (_str_) – Filename, including path, of the file to be removed. Client directory file paths must be absolute, otherwise relative.

Return type:

`None`

fds.fpe.files.remove\_dir(_path_)[#](https://fpe.factset.com/docs/files.html#fds.fpe.files.remove_dir "Link to this definition")

Remove a directory and its contents.

Parameters:

**path** (_str_) – Directory name, including path, of the directory to be removed. Client directory paths must be absolute, otherwise relative.

Return type:

`None`

## File I/O[#](https://fpe.factset.com/docs/files.html#file-i-o "Link to this heading")

**Seek and tell**

```
from fds.fpe.files import open as openfile

# Seek to a position and read from there
# (example assumes test.txt contains 'ABCDE')
f = openfile('test.txt')
f.seek(3)
f.read()   # starts reading from the 3rd character: 'DE'

# Get current file pointer position
with openfile("example.txt", "r") as f:
    f.seek(10)
    print(f.tell())  # 10
```

**Read methods**

```
from fds.fpe.files import open as openfile

# Read entire file as text
with openfile("example.txt", "r") as f:
    print(f.read())

# Read file in binary mode
with openfile("example.parquet", "rb") as f:
    data = f.read()

# Read line by line
with openfile("example.txt", "r") as f:
    while line := f.readline():
        print(line)
```

**Write to a file**

```
from fds.fpe.files import open as openfile

with openfile("example.txt", "w") as f:
    f.write("Hello, world!")
```

File Operations

FileWrapper.close()[#](https://fpe.factset.com/docs/files.html#fds.fpe.files.FileWrapper.close "Link to this definition")

Close the file. If the file was opened in write mode, write the contents to the file. If the file was opened in read mode, do nothing.

Return type:

`None`

FileWrapper.flush()[#](https://fpe.factset.com/docs/files.html#fds.fpe.files.FileWrapper.flush "Link to this definition")

Flush the write buffers of the stream if applicable.

Return type:

`None`

FileWrapper.read(_size\=\-1_)[#](https://fpe.factset.com/docs/files.html#fds.fpe.files.FileWrapper.read "Link to this definition")

Read from the file.

Parameters:

**size** (_int__,_ _optional_) – Number of bytes to read, by default -1.

Returns:

Contents of the file.

Return type:

str or bytes

FileWrapper.readline()[#](https://fpe.factset.com/docs/files.html#fds.fpe.files.FileWrapper.readline "Link to this definition")

Read a single line from the file.

Returns:

A single line from the file.

Return type:

str or bytes

FileWrapper.readlines()[#](https://fpe.factset.com/docs/files.html#fds.fpe.files.FileWrapper.readlines "Link to this definition")

Read all lines from the file.

Returns:

All lines from the file.

Return type:

list of str or bytes

FileWrapper.seek(_offset_, _whence\=0_)[#](https://fpe.factset.com/docs/files.html#fds.fpe.files.FileWrapper.seek "Link to this definition")

Change the file position.

Parameters:

-   **offset** (_int_) – Number of bytes to move the file pointer.
    
-   **whence** (_int__,_ _optional_) – Reference point for the offset, by default 0.
    

Return type:

`None`

FileWrapper.tell()[#](https://fpe.factset.com/docs/files.html#fds.fpe.files.FileWrapper.tell "Link to this definition")

Return the current file pointer position.

Return type:

`int`

FileWrapper.write(_data_)[#](https://fpe.factset.com/docs/files.html#fds.fpe.files.FileWrapper.write "Link to this definition")

Write to the underlying buffer. When the file is flushed or closed it will be written to the file.

Parameters:

**data** (_str_ _or_ _bytes_) – Data to write to the file.

Returns:

Number of bytes written.

Return type:

int

Raises:

**ValueError** – If the file was not opened in write or append mode.

FileWrapper.writelines(_lines_)[#](https://fpe.factset.com/docs/files.html#fds.fpe.files.FileWrapper.writelines "Link to this definition")

Write a list of lines to the file.

Parameters:

**lines** (_list_ _of_ _str_ _or_ _bytes_) – Lines to write to the file.

Return type:

`None`
