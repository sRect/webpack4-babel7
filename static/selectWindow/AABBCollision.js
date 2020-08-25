var collision = {};


// aabb: <THREE.Box3>
// Plane: <THREE.Plane>
collision.isIntersectionAABBPlane = function ( aabb, Plane ) {

  var center = new THREE.Vector3().addVectors( aabb.max, aabb.min ).multiplyScalar( 0.5 ),
      extents = new THREE.Vector3().subVectors( aabb.max, center );

  var r = extents.x * Math.abs( Plane.normal.x ) + extents.y * Math.abs( Plane.normal.y ) + extents.z * Math.abs( Plane.normal.z );
  var s = Plane.normal.dot( center ) - Plane.constant;

  return Math.abs( s ) <= r;

}

// based on http://www.gamedev.net/topic/534655-aabb-triangleplane-intersection--distance-to-plane-is-incorrect-i-have-solved-it/
//
// a: <THREE.Vector3>, // vertex of a triangle
// b: <THREE.Vector3>, // vertex of a triangle
// c: <THREE.Vector3>, // vertex of a triangle
// aabb: <THREE.Box3>
collision.isIntersectionTriangleAABB = function ( a, b, c, aabb ) {

  var p0, p1, p2, r;
  
  // Compute box center and extents of AABoundingBox (if not already given in that format)
  var center = new THREE.Vector3().addVectors( aabb.max, aabb.min ).multiplyScalar( 0.5 ),
      extents = new THREE.Vector3().subVectors( aabb.max, center );

  // Translate triangle as conceptually moving AABB to origin
  var v0 = new THREE.Vector3().subVectors( a, center ),
      v1 = new THREE.Vector3().subVectors( b, center ),
      v2 = new THREE.Vector3().subVectors( c, center );

  // Compute edge vectors for triangle
  var f0 = new THREE.Vector3().subVectors( v1, v0 ),
      f1 = new THREE.Vector3().subVectors( v2, v1 ),
      f2 = new THREE.Vector3().subVectors( v0, v2 );

  // Test axes a00..a22 (category 3)
  var a00 = new THREE.Vector3( 0, -f0.z, f0.y ),
      a01 = new THREE.Vector3( 0, -f1.z, f1.y ),
      a02 = new THREE.Vector3( 0, -f2.z, f2.y ),
      a10 = new THREE.Vector3( f0.z, 0, -f0.x ),
      a11 = new THREE.Vector3( f1.z, 0, -f1.x ),
      a12 = new THREE.Vector3( f2.z, 0, -f2.x ),
      a20 = new THREE.Vector3( -f0.y, f0.x, 0 ),
      a21 = new THREE.Vector3( -f1.y, f1.x, 0 ),
      a22 = new THREE.Vector3( -f2.y, f2.x, 0 );

  // Test axis a00
  p0 = v0.dot( a00 );
  p1 = v1.dot( a00 );
  p2 = v2.dot( a00 );
  r = extents.y * Math.abs( f0.z ) + extents.z * Math.abs( f0.y );

  if ( Math.max( -Math.max( p0, p1, p2 ), Math.min( p0, p1, p2 ) ) > r ) {

    return false; // Axis is a separating axis

  }

  // Test axis a01
  p0 = v0.dot( a01 );
  p1 = v1.dot( a01 );
  p2 = v2.dot( a01 );
  r = extents.y * Math.abs( f1.z ) + extents.z * Math.abs( f1.y );

  if ( Math.max( -Math.max( p0, p1, p2 ), Math.min( p0, p1, p2 ) ) > r ) {

    return false; // Axis is a separating axis

  }

  // Test axis a02
  p0 = v0.dot( a02 );
  p1 = v1.dot( a02 );
  p2 = v2.dot( a02 );
  r = extents.y * Math.abs( f2.z ) + extents.z * Math.abs( f2.y );

  if ( Math.max( -Math.max( p0, p1, p2 ), Math.min( p0, p1, p2 ) ) > r ) {

    return false; // Axis is a separating axis

  }

  // Test axis a10
  p0 = v0.dot( a10 );
  p1 = v1.dot( a10 );
  p2 = v2.dot( a10 );
  r = extents.x * Math.abs( f0.z ) + extents.z * Math.abs( f0.x );
  if ( Math.max( -Math.max( p0, p1, p2 ), Math.min( p0, p1, p2 ) ) > r ) {

    return false; // Axis is a separating axis

  }

  // Test axis a11
  p0 = v0.dot( a11 );
  p1 = v1.dot( a11 );
  p2 = v2.dot( a11 );
  r = extents.x * Math.abs( f1.z ) + extents.z * Math.abs( f1.x );

  if ( Math.max( -Math.max( p0, p1, p2 ), Math.min( p0, p1, p2 ) ) > r ) {

    return false; // Axis is a separating axis

  }

  // Test axis a12
  p0 = v0.dot( a12 );
  p1 = v1.dot( a12 );
  p2 = v2.dot( a12 );
  r = extents.x * Math.abs( f2.z ) + extents.z * Math.abs( f2.x );

  if ( Math.max( -Math.max( p0, p1, p2 ), Math.min( p0, p1, p2 ) ) > r ) {

    return false; // Axis is a separating axis

  }

  // Test axis a20
  p0 = v0.dot( a20 );
  p1 = v1.dot( a20 );
  p2 = v2.dot( a20 );
  r = extents.x * Math.abs( f0.y ) + extents.y * Math.abs( f0.x );

  if ( Math.max( -Math.max( p0, p1, p2 ), Math.min( p0, p1, p2 ) ) > r ) {

    return false; // Axis is a separating axis

  }

  // Test axis a21
  p0 = v0.dot( a21 );
  p1 = v1.dot( a21 );
  p2 = v2.dot( a21 );
  r = extents.x * Math.abs( f1.y ) + extents.y * Math.abs( f1.x );

  if ( Math.max( -Math.max( p0, p1, p2 ), Math.min( p0, p1, p2 ) ) > r ) {

    return false; // Axis is a separating axis

  }

  // Test axis a22
  p0 = v0.dot( a22 );
  p1 = v1.dot( a22 );
  p2 = v2.dot( a22 );
  r = extents.x * Math.abs( f2.y ) + extents.y * Math.abs( f2.x );

  if ( Math.max( -Math.max( p0, p1, p2 ), Math.min( p0, p1, p2 ) ) > r ) {

    return false; // Axis is a separating axis

  }

  // Test the three axes corresponding to the face normals of AABB b (category 1).
  // Exit if...
  // ... [-extents.x, extents.x] and [min(v0.x,v1.x,v2.x), max(v0.x,v1.x,v2.x)] do not overlap
  if ( Math.max( v0.x, v1.x, v2.x ) < -extents.x || Math.min( v0.x, v1.x, v2.x ) > extents.x ) {

    return false;

  }
  // ... [-extents.y, extents.y] and [min(v0.y,v1.y,v2.y), max(v0.y,v1.y,v2.y)] do not overlap
  if ( Math.max( v0.y, v1.y, v2.y ) < -extents.y || Math.min( v0.y, v1.y, v2.y ) > extents.y ) {

    return false;

  }
  // ... [-extents.z, extents.z] and [min(v0.z,v1.z,v2.z), max(v0.z,v1.z,v2.z)] do not overlap
  if ( Math.max( v0.z, v1.z, v2.z ) < -extents.z || Math.min( v0.z, v1.z, v2.z ) > extents.z ) {

    return false;

  }

  // Test separating axis corresponding to triangle face normal (category 2)
  // Face Normal is -ve as Triangle is clockwise winding (and XNA uses -z for into screen)
  var plane = new THREE.Plane();
  plane.normal = new THREE.Vector3().copy( f1 ).cross( f0 ).normalize();
  plane.constant = plane.normal.dot( a );
  
  return collision.isIntersectionAABBPlane( aabb, plane );

}


// sphere1: <THREE.Sphere>
// sphere2: <THREE.Sphere>
collision.isIntersectionSphereSphere = function ( sphere1, sphere2 ) {

  var radiusSum = sphere1.radius + sphere2.radius;

  return sphere1.center.distanceToSquared( sphere2.center ) <= ( radiusSum * radiusSum );

};

// sphere: <THREE.Sphere>
// aabb: <THREE.Box3>
collision.isIntersectionSphereAABB = function ( sphere, aabb ) {

  var i,
      rr = sphere.radius * sphere.radius,
      dmin = 0;

  if ( sphere.center.x < aabb.min.x )     { dmin += Math.sqrt( sphere.center.x - aabb.min.x ) }
  else if( sphere.center.x > aabb.max.x ) { dmin += Math.sqrt( sphere.center.x - aabb.max.x ) }

  if ( sphere.center.y < aabb.min.y )     { dmin += Math.sqrt( sphere.center.y - aabb.min.y ) }
  else if( sphere.center.y > aabb.max.y ) { dmin += Math.sqrt( sphere.center.y - aabb.max.y ) }

  if ( sphere.center.z < aabb.min.z )     { dmin += Math.sqrt( sphere.center.z - aabb.min.z ) }
  else if( sphere.center.z > aabb.max.z ) { dmin += Math.sqrt( sphere.center.z - aabb.max.z ) }

  return dmin <= rr;

};

// based on http://realtimecollisiondetection.net/blog/?p=103
// sphere: <THREE.Sphere>
// a: <THREE.Vector3>, // vertex of a triangle
// b: <THREE.Vector3>, // vertex of a triangle
// c: <THREE.Vector3>, // vertex of a triangle
// normal: <THREE.Vector3>, // normal of a triangle
collision.isIntersectionSphereTriangle = function ( sphere, a, b, c, normal ) {

  // vs plane of traiangle face
  var A = new THREE.Vector3(),
      B = new THREE.Vector3(),
      C = new THREE.Vector3(),
      rr,
      V = new THREE.Vector3(),
      d,
      e;

  A.subVectors( a, sphere.center );
  B.subVectors( b, sphere.center );
  C.subVectors( c, sphere.center );
  rr = sphere.radius * sphere.radius;
  V.crossVectors( B.clone().sub( A ), C.clone().sub( A ) );
  d = A.dot( V );
  e = V.dot( V );

  if ( d * d > rr * e ) {

    return false;

  }

  // vs triangle vertex
  var aa,
      ab,
      ac,
      bb,
      bc,
      cc;

  aa = A.dot( A );
  ab = A.dot( B );
  ac = A.dot( C );
  bb = B.dot( B );
  bc = B.dot( C );
  cc = C.dot( C );

  if (
    ( aa > rr ) & ( ab > aa ) & ( ac > aa ) ||
    ( bb > rr ) & ( ab > bb ) & ( bc > bb ) ||
    ( cc > rr ) & ( ac > cc ) & ( bc > cc )
  ) {

    return false;

  }

  // vs edge
  var AB = new THREE.Vector3(),
      BC = new THREE.Vector3(),
      CA = new THREE.Vector3(),
      d1,
      d2,
      d3,
      e1,
      e2,
      e3,
      Q1 = new THREE.Vector3(),
      Q2 = new THREE.Vector3(),
      Q3 = new THREE.Vector3(),
      QC = new THREE.Vector3(),
      QA = new THREE.Vector3(),
      QB = new THREE.Vector3();

  AB.subVectors( B, A );
  BC.subVectors( C, B );
  CA.subVectors( A, C );
  d1 = ab - aa;
  d2 = bc - bb;
  d3 = ac - cc;
  e1 = AB.dot( AB );
  e2 = BC.dot( BC );
  e3 = CA.dot( CA );
  Q1.subVectors( A.multiplyScalar( e1 ), AB.multiplyScalar( d1 ) );
  Q2.subVectors( B.multiplyScalar( e2 ), BC.multiplyScalar( d2 ) );
  Q3.subVectors( C.multiplyScalar( e3 ), CA.multiplyScalar( d3 ) );
  QC.subVectors( C.multiplyScalar( e1 ), Q1 );
  QA.subVectors( A.multiplyScalar( e2 ), Q2 );
  QB.subVectors( B.multiplyScalar( e3 ), Q3 );

  if (
    ( Q1.dot( Q1 ) > rr * e1 * e1 ) && ( Q1.dot( QC ) >= 0 ) ||
    ( Q2.dot( Q2 ) > rr * e2 * e2 ) && ( Q2.dot( QA ) >= 0 ) ||
    ( Q3.dot( Q3 ) > rr * e3 * e3 ) && ( Q3.dot( QB ) >= 0 )
  ) {

    return false;

  }

  var distance = Math.sqrt( d * d / e ) - sphere.radius,
      contactPoint = new THREE.Vector3(),
      negatedNormal = new THREE.Vector3( -normal.x, -normal.y, -normal.z );

  contactPoint.copy( sphere.center ).add( negatedNormal.multiplyScalar( distance ) );

  return {
    distance    : distance,
    contactPoint: contactPoint
  };

};

// based on Real-Time Collision Detection Section 5.3.6
// p: <THREE.Vector3>, // line3.start
// q: <THREE.Vector3>, // line3.end
// a: <THREE.Vector3>, // triangle.a
// b: <THREE.Vector3>, // triangle.b
// c: <THREE.Vector3>, // triangle.c
// normal: <THREE.Vector3>, // triangle.normal, optional

collision.isIntersectionSegmentTriangle = function ( p, q, a, b, c, normal ) {

  var ab = new THREE.Vector3().subVectors( b, a ),
      ac = new THREE.Vector3().subVectors( c, a ),
      qp = new THREE.Vector3().subVectors( p, q );

  if ( !normal ) {

    normal = new THREE.Vector3().copy( ab ).cross( ac );

  }

  var d = qp.dot( normal );

  if ( d <= 0.0 ) { return false; }

  var ap = new THREE.Vector3().subVectors( p, a ),
      t = ap.dot( normal );

  if ( t < 0 ) { return false; }
  if ( t > d ) { return false; }

  var e = new THREE.Vector3().copy( qp ).cross( ap ),
      v = ac.dot( e );

  if ( v < 0 || v > d ) { return false; }

  var w = -ab.dot( e );

  if ( w < 0 || v + w > d ) { return false; }

  var ood = 1 / d,
      u;

  t *= ood;
  v *= ood;
  w *= ood;
  u = 1 - v - w;

  return new THREE.Vector3( u, v, w );

}

// based on Real-Time Collision Detection Section 5.4.2
// p: <THREE.Vector3>, // point
// a: <THREE.Vector3>, // triangle.a
// b: <THREE.Vector3>, // triangle.c
// c: <THREE.Vector3>, // triangle.c
collision.isPointInTriangle = function ( p, a, b, c ) {

  var v0 = new THREE.Vector3(),
      v1 = new THREE.Vector3(),
      v2 = new THREE.Vector3(),
      u = new THREE.Vector3(),
      v = new THREE.Vector3(),
      w = new THREE.Vector3();

  v0.subVectors( a, p );
  v1.subVectors( b, p );
  v2.subVectors( c, p );

  u.copy( v1 ).cross( v2 );
  v.copy( v2 ).cross( v0 );

  if ( u.dot( v ) < 0 ) {

    return false;

  }

  w.copy( v0 ).cross( v1 );

  if ( u.dot( w ) < 0 ) {

    return false;

  }

  return true;

}