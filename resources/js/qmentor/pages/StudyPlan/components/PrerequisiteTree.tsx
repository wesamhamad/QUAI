import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon,
  ArrowsPointingOutIcon,
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../../contexts/LanguageContext';
import Card from '../../../components/ui/Card';
import type { Course } from '../types';

interface Props {
  courses: Course[];
}

const statusColors: Record<string, { bg: string; border: string; text: string; fill: string }> = {
  completed:     { bg: 'bg-emerald-100 dark:bg-emerald-900/40', border: 'border-emerald-500', text: 'text-emerald-700 dark:text-emerald-300', fill: '#10b981' },
  'in-progress': { bg: 'bg-blue-100 dark:bg-blue-900/40', border: 'border-blue-500', text: 'text-blue-700 dark:text-blue-300', fill: '#3b82f6' },
  available:     { bg: 'bg-amber-100 dark:bg-amber-900/40', border: 'border-amber-500', text: 'text-amber-700 dark:text-amber-300', fill: '#f59e0b' },
  locked:        { bg: 'bg-gray-100 dark:bg-gray-700/60', border: 'border-gray-400 dark:border-gray-600', text: 'text-gray-500 dark:text-gray-400', fill: '#9ca3af' },
};

const statusLabelsAr: Record<string, string> = { completed: 'مكتمل', 'in-progress': 'حالي', available: 'متاح', locked: 'مقفل' };
const statusLabelsEn: Record<string, string> = { completed: 'Completed', 'in-progress': 'In Progress', available: 'Available', locked: 'Locked' };

const categoryLabelsAr: Record<string, string> = { 'university': 'جامعي', 'college': 'كلية', 'major-core': 'تخصص إجباري', 'major-elective': 'تخصص اختياري', 'free-elective': 'حر' };
const categoryLabelsEn: Record<string, string> = { 'university': 'University', 'college': 'College', 'major-core': 'Core', 'major-elective': 'Major Elective', 'free-elective': 'Free Elective' };

// Node dimensions
const NODE_W = 150;
const NODE_H = 70;
const NODE_GAP_X = 30;
const NODE_GAP_Y = 40;
const SEMESTER_LABEL_W = 80;

export default function PrerequisiteTree({ courses }: Props) {
  const { t, dir } = useLanguage();
  const isRtl = dir === 'rtl';
  const [selected, setSelected] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Zoom & pan state
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const courseMap = useMemo(() => new Map(courses.map(c => [c.code, c])), [courses]);

  // Group courses by semester
  const bySemester = useMemo(() => {
    const map = new Map<number, Course[]>();
    courses.forEach(c => {
      const list = map.get(c.planSemester) || [];
      list.push(c);
      map.set(c.planSemester, list);
    });
    return Array.from(map.entries()).sort(([a], [b]) => a - b);
  }, [courses]);

  // Apply filter
  const filteredBySemester = useMemo(() => {
    if (filterStatus === 'all') return bySemester;
    return bySemester
      .map(([sem, list]) => [sem, list.filter(c => c.status === filterStatus)] as [number, Course[]])
      .filter(([, list]) => list.length > 0);
  }, [bySemester, filterStatus]);

  // Get prerequisite chain for a course
  const getChain = useCallback((code: string, visited = new Set<string>()): string[] => {
    if (visited.has(code)) return [];
    visited.add(code);
    const course = courseMap.get(code);
    if (!course) return [];
    const chain: string[] = [];
    for (const pre of course.prerequisites) {
      chain.push(pre, ...getChain(pre, visited));
    }
    return chain;
  }, [courseMap]);

  // Highlight related courses
  const selectedCourse = selected ? courseMap.get(selected) : null;
  const chainCodes = selected ? new Set(getChain(selected)) : new Set<string>();
  const dependents = useMemo(() => {
    if (!selected) return new Set<string>();
    const deps = new Set<string>();
    courses.forEach(c => {
      if (c.prerequisites.includes(selected)) deps.add(c.code);
    });
    return deps;
  }, [selected, courses]);

  // Calculate node positions for SVG connections
  const nodePositions = useMemo(() => {
    const positions = new Map<string, { x: number; y: number }>();
    let rowY = 0;
    for (const [, semCourses] of filteredBySemester) {
      const filteredCourses = semCourses;
      filteredCourses.forEach((course, colIdx) => {
        const x = SEMESTER_LABEL_W + colIdx * (NODE_W + NODE_GAP_X);
        positions.set(course.code, { x, y: rowY });
      });
      rowY += NODE_H + NODE_GAP_Y;
    }
    return positions;
  }, [filteredBySemester]);

  // SVG connection lines between prerequisites
  const connections = useMemo(() => {
    const lines: { from: { x: number; y: number }; to: { x: number; y: number }; highlighted: boolean; isChain: boolean; isDependent: boolean }[] = [];
    for (const [, semCourses] of filteredBySemester) {
      for (const course of semCourses) {
        const toPos = nodePositions.get(course.code);
        if (!toPos) continue;
        for (const preCode of course.prerequisites) {
          const fromPos = nodePositions.get(preCode);
          if (!fromPos) continue;
          const highlighted = selected === course.code || selected === preCode;
          const isChain = chainCodes.has(preCode) && chainCodes.has(course.code);
          const isDependent = dependents.has(course.code) && selected === preCode;
          lines.push({
            from: { x: fromPos.x + NODE_W / 2, y: fromPos.y + NODE_H },
            to: { x: toPos.x + NODE_W / 2, y: toPos.y },
            highlighted: highlighted || isChain || isDependent,
            isChain,
            isDependent,
          });
        }
      }
    }
    return lines;
  }, [filteredBySemester, nodePositions, selected, chainCodes, dependents]);

  // Total SVG dimensions
  const svgDimensions = useMemo(() => {
    let maxX = 0;
    let maxY = 0;
    nodePositions.forEach(pos => {
      maxX = Math.max(maxX, pos.x + NODE_W + 20);
      maxY = Math.max(maxY, pos.y + NODE_H + 20);
    });
    return { width: Math.max(maxX, 800), height: Math.max(maxY, 200) };
  }, [nodePositions]);

  // Zoom controls
  const zoomIn = () => setScale(s => Math.min(s + 0.15, 2));
  const zoomOut = () => setScale(s => Math.max(s - 0.15, 0.4));
  const resetView = () => { setScale(1); setTranslate({ x: 0, y: 0 }); };

  // Mouse wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.08 : 0.08;
    setScale(s => Math.min(Math.max(s + delta, 0.4), 2));
  }, []);

  // Pan handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - translate.x, y: e.clientY - translate.y });
    }
  }, [translate]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning) return;
    setTranslate({
      x: e.clientX - panStart.x,
      y: e.clientY - panStart.y,
    });
  }, [isPanning, panStart]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Clean up pan on mouse leave
  useEffect(() => {
    const handleGlobalUp = () => setIsPanning(false);
    window.addEventListener('mouseup', handleGlobalUp);
    return () => window.removeEventListener('mouseup', handleGlobalUp);
  }, []);

  return (
    <div className="space-y-4">
      {/* Filters, Legend & Zoom Controls */}
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {['all', 'completed', 'in-progress', 'available', 'locked'].map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filterStatus === s
                    ? 'bg-sa-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {s === 'all' ? t('الكل', 'All') : t(statusLabelsAr[s], statusLabelsEn[s])}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 text-xs">
              {Object.entries(statusColors).map(([status, colors]) => (
                <div key={status} className="flex items-center gap-1">
                  <div className={`w-3 h-3 rounded border-2 ${colors.bg} ${colors.border}`} />
                  <span className="text-gray-500 dark:text-gray-400">{t(statusLabelsAr[status], statusLabelsEn[status])}</span>
                </div>
              ))}
            </div>
            <div className="border-s border-gray-200 dark:border-gray-600 ps-3 flex items-center gap-1">
              <button onClick={zoomOut} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 transition-colors" title={t('تصغير', 'Zoom Out')}>
                <MagnifyingGlassMinusIcon className="w-4 h-4" />
              </button>
              <span className="text-xs text-gray-500 min-w-[40px] text-center">{Math.round(scale * 100)}%</span>
              <button onClick={zoomIn} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 transition-colors" title={t('تكبير', 'Zoom In')}>
                <MagnifyingGlassPlusIcon className="w-4 h-4" />
              </button>
              <button onClick={resetView} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 transition-colors" title={t('إعادة ضبط', 'Reset View')}>
                <ArrowsPointingOutIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Interactive Graph Canvas */}
      <div
        ref={containerRef}
        className="relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        style={{ height: '500px', cursor: isPanning ? 'grabbing' : 'grab' }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <div
          style={{
            transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
            transformOrigin: '0 0',
            transition: isPanning ? 'none' : 'transform 0.2s ease-out',
            padding: '20px',
          }}
        >
          {/* SVG Connections Layer */}
          <svg
            width={svgDimensions.width}
            height={svgDimensions.height}
            className="absolute top-0 start-0 pointer-events-none"
            style={{ zIndex: 0 }}
          >
            <defs>
              <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="#9ca3af" />
              </marker>
              <marker id="arrowhead-highlight" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="#10b981" />
              </marker>
              <marker id="arrowhead-dependent" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="#f59e0b" />
              </marker>
            </defs>
            {connections.map((conn, i) => {
              const midY = (conn.from.y + conn.to.y) / 2;
              const path = `M ${conn.from.x + 20} ${conn.from.y} C ${conn.from.x + 20} ${midY}, ${conn.to.x + 20} ${midY}, ${conn.to.x + 20} ${conn.to.y}`;
              const stroke = conn.isDependent ? '#f59e0b' : conn.highlighted ? '#10b981' : '#d1d5db';
              const marker = conn.isDependent ? 'url(#arrowhead-dependent)' : conn.highlighted ? 'url(#arrowhead-highlight)' : 'url(#arrowhead)';
              return (
                <path
                  key={i}
                  d={path}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={conn.highlighted ? 2.5 : 1.5}
                  strokeDasharray={conn.highlighted ? 'none' : '4 3'}
                  markerEnd={marker}
                  opacity={conn.highlighted ? 1 : 0.4}
                  className="transition-all duration-300"
                />
              );
            })}
          </svg>

          {/* Course Nodes Layer */}
          <div className="relative" style={{ zIndex: 1 }}>
            {filteredBySemester.map(([semester, semCourses], rowIdx) => {
              let rowY = 0;
              for (let r = 0; r < rowIdx; r++) {
                rowY += NODE_H + NODE_GAP_Y;
              }

              return (
                <div key={semester} className="absolute" style={{ top: rowY, left: 0, right: 0 }}>
                  {/* Semester label */}
                  <div
                    className="absolute flex items-center"
                    style={{ top: NODE_H / 2 - 10, left: 0, width: SEMESTER_LABEL_W }}
                  >
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {t(`الفصل ${semester}`, `Sem ${semester}`)}
                    </span>
                  </div>

                  {/* Course nodes */}
                  {semCourses.map((course, colIdx) => {
                    const colors = statusColors[course.status];
                    const isSelected = selected === course.code;
                    const isChain = chainCodes.has(course.code);
                    const isDependent = dependents.has(course.code);
                    const highlight = isSelected ? 'ring-2 ring-sa-500 scale-105 shadow-lg' : isChain ? 'ring-2 ring-emerald-400 shadow-md' : isDependent ? 'ring-2 ring-amber-400 shadow-md' : '';
                    const dimmed = selected && !isSelected && !isChain && !isDependent ? 'opacity-40' : '';

                    return (
                      <button
                        key={course.code}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelected(isSelected ? null : course.code);
                        }}
                        className={`absolute p-2.5 rounded-xl border-2 ${colors.bg} ${colors.border} ${colors.text} ${highlight} ${dimmed} transition-all hover:scale-105 text-start`}
                        style={{
                          left: SEMESTER_LABEL_W + colIdx * (NODE_W + NODE_GAP_X),
                          top: 0,
                          width: NODE_W,
                          height: NODE_H,
                        }}
                      >
                        <div className="text-xs font-bold">{course.code}</div>
                        <div className="text-[11px] mt-0.5 line-clamp-1">{t(course.nameAr, course.nameEn)}</div>
                        <div className="text-[10px] opacity-70 mt-0.5">
                          {course.creditHours} {t('س', 'cr')} · {t(categoryLabelsAr[course.category], categoryLabelsEn[course.category])}
                        </div>
                        {course.grade && (
                          <span className="absolute top-1 end-1 text-[10px] font-bold bg-white dark:bg-gray-800 px-1 rounded">
                            {course.grade}
                          </span>
                        )}
                        {/* Status dot */}
                        <span
                          className="absolute -top-1 -start-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800"
                          style={{ backgroundColor: colors.fill }}
                        />
                      </button>
                    );
                  })}
                </div>
              );
            })}
            {/* Spacer to ensure the container has the right height */}
            <div style={{ height: svgDimensions.height }} />
          </div>
        </div>
      </div>

      {/* Selected Course Detail Panel */}
      {selectedCourse && (
        <Card className="border-s-4 border-s-sa-500">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {selectedCourse.code} — {t(selectedCourse.nameAr, selectedCourse.nameEn)}
              </h3>
              {selectedCourse.descriptionAr && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {t(selectedCourse.descriptionAr, selectedCourse.descriptionEn || '')}
                </p>
              )}
              <div className="flex flex-wrap gap-3 mt-3 text-xs">
                <span className="px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                  {selectedCourse.creditHours} {t('ساعات', 'credits')}
                </span>
                <span className={`px-2 py-1 rounded-lg ${statusColors[selectedCourse.status].bg} ${statusColors[selectedCourse.status].text}`}>
                  {t(statusLabelsAr[selectedCourse.status], statusLabelsEn[selectedCourse.status])}
                </span>
                <span className="px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                  {t(categoryLabelsAr[selectedCourse.category], categoryLabelsEn[selectedCourse.category])}
                </span>
                <span className="px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                  {t(`الفصل ${selectedCourse.planSemester}`, `Semester ${selectedCourse.planSemester}`)}
                </span>
              </div>
            </div>
            <div className="sm:w-56">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t('المتطلبات السابقة', 'Prerequisites')}</p>
              {selectedCourse.prerequisites.length === 0 ? (
                <p className="text-xs text-gray-400">{t('لا يوجد', 'None')}</p>
              ) : (
                <div className="flex flex-wrap gap-1">
                  {selectedCourse.prerequisites.map(pre => {
                    const preCourse = courseMap.get(pre);
                    const preColors = preCourse ? statusColors[preCourse.status] : statusColors.locked;
                    return (
                      <button
                        key={pre}
                        onClick={() => setSelected(pre)}
                        className={`px-2 py-0.5 rounded text-[11px] font-medium border ${preColors.bg} ${preColors.border} ${preColors.text} hover:scale-105 transition-transform`}
                      >
                        {pre}
                      </button>
                    );
                  })}
                </div>
              )}
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-3 mb-1">{t('يفتح مقررات', 'Unlocks')}</p>
              {dependents.size === 0 ? (
                <p className="text-xs text-gray-400">{t('لا يوجد', 'None')}</p>
              ) : (
                <div className="flex flex-wrap gap-1">
                  {Array.from(dependents).map(dep => (
                    <button
                      key={dep}
                      onClick={() => setSelected(dep)}
                      className="px-2 py-0.5 rounded text-[11px] font-medium border border-amber-400 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 hover:scale-105 transition-transform"
                    >
                      {dep}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
