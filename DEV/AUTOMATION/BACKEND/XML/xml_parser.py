"""
XML Parser for LLM-Generated Algorithm Tracer Artifacts

Parses XML output from the Backend Tracer Generator LLM using lxml 
(forgiving parsing) and Pydantic (strict validation).

Usage:
    result = parse_tracer_xml(xml_string)
    save_files(result)
"""

from typing import List
from pydantic import BaseModel, Field, validator
from lxml import etree
from pathlib import Path


# Pydantic Models

class FileArtifact(BaseModel):
    """A single generated file"""
    path: str
    content: str
    
    @validator('path')
    def validate_path(cls, v):
        if not v.strip():
            raise ValueError("Path cannot be empty")
        return v
    
    @validator('content')
    def validate_content(cls, v):
        if not v.strip():
            raise ValueError("Content cannot be empty")
        return v


class ProjectResult(BaseModel):
    """Complete generation result"""
    project_name: str
    description: str
    files: List[FileArtifact] = Field(..., min_items=1)
    
    @validator('files')
    def validate_file_count(cls, v):
        if len(v) != 3:
            raise ValueError(f"Expected 3 files, got {len(v)}")
        return v


# Parser Function

def parse_tracer_xml(xml_string: str) -> ProjectResult:
    """
    Parse XML from LLM into validated Python objects.
    
    Args:
        xml_string: Raw XML string (including <?xml declaration)
    
    Returns:
        ProjectResult with validated data
    
    Raises:
        ValueError: If parsing or validation fails
    """
    try:
        # Parse with recovery mode for malformed XML
        parser = etree.XMLParser(recover=True, remove_blank_text=True)
        root = etree.fromstring(xml_string.encode('utf-8'), parser=parser)
        
        # Check for error response
        if root.tag == 'error':
            error_msg = root.find('message')
            raise ValueError(f"LLM Error: {error_msg.text if error_msg is not None else 'Unknown error'}")
        
        # Validate root element
        if root.tag != 'project':
            raise ValueError(f"Invalid root: expected 'project', got '{root.tag}'")
        
        # Extract data
        data = {
            'project_name': _get_text(root, 'project_name'),
            'description': _get_text(root, 'description'),
            'files': _parse_files(root)
        }
        
        # Validate with Pydantic
        return ProjectResult(**data)
        
    except etree.XMLSyntaxError as e:
        raise ValueError(f"XML syntax error: {e}")
    except Exception as e:
        raise ValueError(f"Parsing failed: {e}")


def _parse_files(root: etree._Element) -> List[dict]:
    """Extract files from XML"""
    files_elem = root.find('files')
    if files_elem is None:
        raise ValueError("Missing <files> element")
    
    files = []
    for file_elem in files_elem.findall('file'):
        path = file_elem.find('path')
        content = file_elem.find('content')
        
        if path is None or content is None:
            raise ValueError("File missing <path> or <content>")
        
        # lxml handles CDATA automatically
        files.append({
            'path': path.text.strip() if path.text else '',
            'content': content.text or ''
        })
    
    return files


def _get_text(element: etree._Element, tag: str) -> str:
    """Safely get text from element"""
    child = element.find(tag)
    if child is None:
        raise ValueError(f"Missing <{tag}> element")
    if child.text is None:
        raise ValueError(f"<{tag}> is empty")
    return child.text.strip()


# Utility Functions

def save_files(result: ProjectResult, base_dir: str = ".") -> None:
    """
    Save generated files to disk.
    
    Args:
        result: Parsed generation result
        base_dir: Base directory for output
    """
    for file in result.files:
        full_path = Path(base_dir) / file.path
        full_path.parent.mkdir(parents=True, exist_ok=True)
        
        full_path.write_text(file.content, encoding='utf-8')
        print(f"✓ {full_path}")


# Example Usage

if __name__ == "__main__":
    example_xml = """<?xml version="1.0" encoding="UTF-8"?>
<project>
  <project_name>quick-sort</project_name>
  <description>Quick sort algorithm with array visualization</description>
  <files>
    <file>
      <path>backend/algorithms/quick_sort_tracer.py</path>
      <content><![CDATA[
"""Quick Sort Tracer"""
from typing import Any
from .base_tracer import AlgorithmTracer

class QuickSortTracer(AlgorithmTracer):
    def execute(self, input_data: Any) -> dict:
        # Implementation
        pass
      ]]></content>
    </file>
    <file>
      <path>backend/algorithms/tests/test_quick_sort_tracer.py</path>
      <content><![CDATA[
import pytest

def test_basic():
    assert True
      ]]></content>
    </file>
    <file>
      <path>docs/algorithm-info/quick-sort.md</path>
      <content><![CDATA[
# Quick Sort

Efficient sorting algorithm.
      ]]></content>
    </file>
  </files>
</project>
"""
    
    try:
        result = parse_tracer_xml(example_xml)
        print(f"✓ Parsed: {result.project_name}")
        print(f"  Files: {len(result.files)}")
        
        # Save files
        # save_files(result, "output")
        
    except ValueError as e:
        print(f"❌ Error: {e}")