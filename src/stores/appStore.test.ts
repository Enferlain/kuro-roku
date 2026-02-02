// Property-based tests for store selection logic
// Feature: library-ui-polish

import { describe, test, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { useAppStore } from './appStore';
import { ScannedFile } from '@/types';

// Helper to create a mock ScannedFile
const createMockFile = (path: string): ScannedFile => ({
  path,
  file_name: `file_${path}.mp4`,
  file_extension: 'mp4',
  file_type: 'video',
  file_size: 1024,
  created_at: '2024-01-01T00:00:00Z',
  modified_at: '2024-01-01T00:00:00Z',
});

// Arbitrary for generating file IDs (paths)
const fileIdArb = fc.string({ minLength: 1, maxLength: 20 }).map(s => `file_${s}`);

// Arbitrary for generating arrays of unique file IDs
const fileIdsArb = fc.uniqueArray(fileIdArb, { minLength: 0, maxLength: 50 });

describe('Store Selection Logic - Property Tests', () => {
  beforeEach(() => {
    // Reset store state before each test
    const store = useAppStore.getState();
    store.deselectAll();
    useAppStore.setState({ files: [], currentPath: null });
  });

  // **Property 1: Single-click selection replaces**
  // **Validates: Requirements 1.1**
  test('Property 1: Single-click selection replaces - for any file list and current selection, single-click selects only that file', () => {
    fc.assert(
      fc.property(
        fileIdsArb,
        fileIdsArb,
        fileIdArb,
        (allFileIds, currentSelectionIds, clickedFileId) => {
          // Setup: Create files and set initial selection
          const files = allFileIds.map(createMockFile);
          const store = useAppStore.getState();
          
          useAppStore.setState({ 
            files,
            selectedFileIds: currentSelectionIds.filter(id => allFileIds.includes(id))
          });

          // Action: Single-click (isMultiSelect = false)
          store.toggleSelection(clickedFileId, false);

          // Assertion: Only the clicked file should be selected
          const newSelection = useAppStore.getState().selectedFileIds;
          expect(newSelection).toEqual([clickedFileId]);
          expect(newSelection.length).toBe(1);
        }
      ),
      { numRuns: 100 }
    );
  });

  // **Property 2: Multi-select toggle preserves other selections**
  // **Validates: Requirements 1.2**
  test('Property 2: Multi-select toggle preserves other selections - toggling one file does not affect others', () => {
    fc.assert(
      fc.property(
        fileIdsArb.filter(ids => ids.length > 0),
        fc.integer({ min: 0, max: 100 }).chain(seed => 
          fc.constant(seed).chain(s => 
            fileIdsArb.filter(ids => ids.length > 0).map(ids => ({
              allFileIds: ids,
              currentSelectionIds: ids.filter(() => Math.random() < 0.5),
              seed: s
            }))
          )
        ),
        (allFileIds, { currentSelectionIds }) => {
          // Setup: Create files and set initial selection
          const files = allFileIds.map(createMockFile);
          const store = useAppStore.getState();
          
          useAppStore.setState({ 
            files,
            selectedFileIds: currentSelectionIds
          });

          // Pick a file to toggle
          const toggleFileId = allFileIds[0];
          const wasSelected = currentSelectionIds.includes(toggleFileId);
          
          // Track other files' selection state
          const otherFiles = allFileIds.filter(id => id !== toggleFileId);
          const otherFilesSelectedBefore = otherFiles.filter(id => 
            currentSelectionIds.includes(id)
          );

          // Action: Multi-select toggle (isMultiSelect = true)
          store.toggleSelection(toggleFileId, true);

          // Assertion: Other files' selection state should be unchanged
          const newSelection = useAppStore.getState().selectedFileIds;
          const otherFilesSelectedAfter = otherFiles.filter(id => 
            newSelection.includes(id)
          );
          
          expect(otherFilesSelectedAfter.sort()).toEqual(otherFilesSelectedBefore.sort());
          
          // The toggled file should have opposite state
          if (wasSelected) {
            expect(newSelection).not.toContain(toggleFileId);
          } else {
            expect(newSelection).toContain(toggleFileId);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  // **Property 3: Select all selects all files**
  // **Validates: Requirements 3.2**
  test('Property 3: Select all selects all files - for any file list, selectAll selects every file', () => {
    fc.assert(
      fc.property(
        fileIdsArb,
        fileIdsArb,
        (allFileIds, currentSelectionIds) => {
          // Setup: Create files and set initial selection
          const files = allFileIds.map(createMockFile);
          const store = useAppStore.getState();
          
          useAppStore.setState({ 
            files,
            selectedFileIds: currentSelectionIds.filter(id => allFileIds.includes(id))
          });

          // Action: Select all
          store.selectAll();

          // Assertion: All files should be selected
          const newSelection = useAppStore.getState().selectedFileIds;
          expect(newSelection.sort()).toEqual(allFileIds.sort());
          expect(newSelection.length).toBe(allFileIds.length);
          
          // Every file should be in the selection
          allFileIds.forEach(fileId => {
            expect(newSelection).toContain(fileId);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  // **Property 8: getSelectedFiles returns correct objects**
  // **Validates: Requirements 12.5**
  test('Property 8: getSelectedFiles returns correct objects - returns exactly the files whose IDs are selected', () => {
    fc.assert(
      fc.property(
        fileIdsArb.filter(ids => ids.length > 0),
        (allFileIds) => {
          // Setup: Create files
          const files = allFileIds.map(createMockFile);
          const store = useAppStore.getState();
          
          useAppStore.setState({ files });

          // Select a random subset of files
          const selectedIds = allFileIds.filter(() => Math.random() < 0.5);
          useAppStore.setState({ selectedFileIds: selectedIds });

          // Action: Get selected files
          const selectedFiles = store.getSelectedFiles();

          // Assertion: Should return exactly the selected file objects
          expect(selectedFiles.length).toBe(selectedIds.length);
          
          // Every returned file should be in the selected IDs
          selectedFiles.forEach(file => {
            expect(selectedIds).toContain(file.path);
          });
          
          // Every selected ID should have a corresponding file
          selectedIds.forEach(id => {
            const found = selectedFiles.find(f => f.path === id);
            expect(found).toBeDefined();
            expect(found?.path).toBe(id);
          });
          
          // Files should be in the same order as they appear in the files array
          const expectedOrder = files
            .filter(f => selectedIds.includes(f.path))
            .map(f => f.path);
          const actualOrder = selectedFiles.map(f => f.path);
          expect(actualOrder).toEqual(expectedOrder);
        }
      ),
      { numRuns: 100 }
    );
  });

  // **Property 9: Selection persists across view mode changes**
  // **Validates: Requirements 12.6**
  test('Property 9: Selection persists across view mode changes - selectedFileIds unchanged when view mode changes', () => {
    fc.assert(
      fc.property(
        fileIdsArb,
        fileIdsArb,
        fc.constantFrom('grid' as const, 'list' as const, 'treemap' as const),
        fc.constantFrom('grid' as const, 'list' as const, 'treemap' as const),
        (allFileIds, currentSelectionIds, initialViewMode, newViewMode) => {
          // Setup: Create files and set initial selection and view mode
          const files = allFileIds.map(createMockFile);
          const store = useAppStore.getState();
          
          const validSelection = currentSelectionIds.filter(id => allFileIds.includes(id));
          useAppStore.setState({ 
            files,
            selectedFileIds: validSelection,
            viewMode: initialViewMode
          });

          // Capture selection before view mode change
          const selectionBefore = [...useAppStore.getState().selectedFileIds];

          // Action: Change view mode
          store.setViewMode(newViewMode);

          // Assertion: Selection should be unchanged
          const selectionAfter = useAppStore.getState().selectedFileIds;
          expect(selectionAfter).toEqual(selectionBefore);
          
          // Verify view mode actually changed
          expect(useAppStore.getState().viewMode).toBe(newViewMode);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Unit tests for store selection actions
// Feature: library-ui-polish
// These tests complement the property tests with specific examples and edge cases
describe('Store Selection Actions - Unit Tests', () => {
  beforeEach(() => {
    // Reset store state before each test
    const store = useAppStore.getState();
    store.deselectAll();
    useAppStore.setState({ files: [], currentPath: null });
  });

  describe('toggleSelection with multi=false (single select)', () => {
    test('selects only the clicked file when no files are selected', () => {
      // Setup
      const files = [
        createMockFile('file1'),
        createMockFile('file2'),
        createMockFile('file3'),
      ];
      useAppStore.setState({ files, selectedFileIds: [] });

      // Action: Single-click file2
      useAppStore.getState().toggleSelection('file2', false);

      // Assert: Only file2 is selected
      expect(useAppStore.getState().selectedFileIds).toEqual(['file2']);
    });

    test('replaces existing selection with clicked file', () => {
      // Setup: file1 and file3 are already selected
      const files = [
        createMockFile('file1'),
        createMockFile('file2'),
        createMockFile('file3'),
      ];
      useAppStore.setState({ files, selectedFileIds: ['file1', 'file3'] });

      // Action: Single-click file2
      useAppStore.getState().toggleSelection('file2', false);

      // Assert: Only file2 is selected, file1 and file3 are deselected
      expect(useAppStore.getState().selectedFileIds).toEqual(['file2']);
    });

    test('selects the same file again when clicking already selected file', () => {
      // Setup: file2 is already selected
      const files = [
        createMockFile('file1'),
        createMockFile('file2'),
        createMockFile('file3'),
      ];
      useAppStore.setState({ files, selectedFileIds: ['file2'] });

      // Action: Single-click file2 again
      useAppStore.getState().toggleSelection('file2', false);

      // Assert: file2 remains selected (selection replaced with itself)
      expect(useAppStore.getState().selectedFileIds).toEqual(['file2']);
    });
  });

  describe('toggleSelection with multi=true (multi select)', () => {
    test('adds file to empty selection', () => {
      // Setup
      const files = [
        createMockFile('file1'),
        createMockFile('file2'),
        createMockFile('file3'),
      ];
      useAppStore.setState({ files, selectedFileIds: [] });

      // Action: Cmd/Ctrl+click file2
      useAppStore.getState().toggleSelection('file2', true);

      // Assert: file2 is added to selection
      expect(useAppStore.getState().selectedFileIds).toEqual(['file2']);
    });

    test('adds file to existing selection', () => {
      // Setup: file1 is already selected
      const files = [
        createMockFile('file1'),
        createMockFile('file2'),
        createMockFile('file3'),
      ];
      useAppStore.setState({ files, selectedFileIds: ['file1'] });

      // Action: Cmd/Ctrl+click file3
      useAppStore.getState().toggleSelection('file3', true);

      // Assert: file3 is added, file1 remains selected
      expect(useAppStore.getState().selectedFileIds).toEqual(['file1', 'file3']);
    });

    test('removes file from selection when already selected', () => {
      // Setup: file1 and file2 are selected
      const files = [
        createMockFile('file1'),
        createMockFile('file2'),
        createMockFile('file3'),
      ];
      useAppStore.setState({ files, selectedFileIds: ['file1', 'file2'] });

      // Action: Cmd/Ctrl+click file2 (toggle off)
      useAppStore.getState().toggleSelection('file2', true);

      // Assert: file2 is removed, file1 remains selected
      expect(useAppStore.getState().selectedFileIds).toEqual(['file1']);
    });

    test('preserves other selections when toggling', () => {
      // Setup: file1, file2, file4 are selected
      const files = [
        createMockFile('file1'),
        createMockFile('file2'),
        createMockFile('file3'),
        createMockFile('file4'),
        createMockFile('file5'),
      ];
      useAppStore.setState({ files, selectedFileIds: ['file1', 'file2', 'file4'] });

      // Action: Cmd/Ctrl+click file3 (add)
      useAppStore.getState().toggleSelection('file3', true);

      // Assert: file3 is added, others remain
      const selectedFileIds = useAppStore.getState().selectedFileIds;
      expect(selectedFileIds).toContain('file1');
      expect(selectedFileIds).toContain('file2');
      expect(selectedFileIds).toContain('file3');
      expect(selectedFileIds).toContain('file4');
      expect(selectedFileIds.length).toBe(4);
    });
  });

  describe('selectAll behavior', () => {
    test('selects all files when none are selected', () => {
      // Setup
      const files = [
        createMockFile('file1'),
        createMockFile('file2'),
        createMockFile('file3'),
      ];
      useAppStore.setState({ files, selectedFileIds: [] });

      // Action: Select all
      useAppStore.getState().selectAll();

      // Assert: All files are selected
      expect(useAppStore.getState().selectedFileIds).toEqual(['file1', 'file2', 'file3']);
    });

    test('selects all files when some are selected', () => {
      // Setup: file1 is selected
      const files = [
        createMockFile('file1'),
        createMockFile('file2'),
        createMockFile('file3'),
      ];
      useAppStore.setState({ files, selectedFileIds: ['file1'] });

      // Action: Select all
      useAppStore.getState().selectAll();

      // Assert: All files are now selected
      expect(useAppStore.getState().selectedFileIds).toEqual(['file1', 'file2', 'file3']);
    });

    test('handles empty file list', () => {
      // Setup: No files
      useAppStore.setState({ files: [], selectedFileIds: [] });

      // Action: Select all
      useAppStore.getState().selectAll();

      // Assert: Selection remains empty
      expect(useAppStore.getState().selectedFileIds).toEqual([]);
    });

    test('selects all files even when all are already selected', () => {
      // Setup: All files already selected
      const files = [
        createMockFile('file1'),
        createMockFile('file2'),
        createMockFile('file3'),
      ];
      useAppStore.setState({ files, selectedFileIds: ['file1', 'file2', 'file3'] });

      // Action: Select all
      useAppStore.getState().selectAll();

      // Assert: All files remain selected (idempotent operation)
      expect(useAppStore.getState().selectedFileIds).toEqual(['file1', 'file2', 'file3']);
    });
  });

  describe('deselectAll behavior', () => {
    test('clears all selections when multiple files are selected', () => {
      // Setup: Multiple files selected
      const files = [
        createMockFile('file1'),
        createMockFile('file2'),
        createMockFile('file3'),
      ];
      useAppStore.setState({ files, selectedFileIds: ['file1', 'file2', 'file3'] });

      // Action: Deselect all
      useAppStore.getState().deselectAll();

      // Assert: No files are selected
      expect(useAppStore.getState().selectedFileIds).toEqual([]);
    });

    test('clears selection when one file is selected', () => {
      // Setup: One file selected
      const files = [
        createMockFile('file1'),
        createMockFile('file2'),
      ];
      useAppStore.setState({ files, selectedFileIds: ['file1'] });

      // Action: Deselect all
      useAppStore.getState().deselectAll();

      // Assert: No files are selected
      expect(useAppStore.getState().selectedFileIds).toEqual([]);
    });

    test('handles empty selection gracefully', () => {
      // Setup: No files selected
      const files = [
        createMockFile('file1'),
        createMockFile('file2'),
      ];
      useAppStore.setState({ files, selectedFileIds: [] });

      // Action: Deselect all
      useAppStore.getState().deselectAll();

      // Assert: Selection remains empty (idempotent operation)
      expect(useAppStore.getState().selectedFileIds).toEqual([]);
    });
  });

  describe('Edge case: selectAll when all selected (toggle behavior)', () => {
    test('selectAll does not toggle - it always selects all files', () => {
      // Note: Based on the current implementation, selectAll() always selects all files
      // It does NOT toggle (deselect when all are selected)
      // This test documents the actual behavior
      
      // Setup: All files already selected
      const files = [
        createMockFile('file1'),
        createMockFile('file2'),
        createMockFile('file3'),
      ];
      useAppStore.setState({ files, selectedFileIds: ['file1', 'file2', 'file3'] });
      const store = useAppStore.getState();

      // Action: Select all when all are already selected
      store.selectAll();

      // Assert: All files remain selected (no toggle behavior)
      expect(store.selectedFileIds).toEqual(['file1', 'file2', 'file3']);
      
      // Note: If toggle behavior is desired (deselect when all selected),
      // the implementation would need to be updated to check if all files
      // are already selected and call deselectAll() in that case
    });
  });
});
